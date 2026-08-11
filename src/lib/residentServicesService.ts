import { supabase } from './supabase';
import { ResidentServiceProfile, ServiceReview } from '@/components/condo-market/types';
import { compressImage } from './imageCompression';

const STORAGE_KEY_PROFILES = 'condo_resident_service_profiles';
const STORAGE_KEY_REVIEWS = 'condo_resident_service_reviews';

function getLocalProfiles(): ResidentServiceProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalProfiles(profiles: ResidentServiceProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error("Erro ao salvar perfis locais:", e);
  }
}

function getLocalReviews(): ServiceReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalReviews(reviews: ServiceReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error("Erro ao salvar avaliações locais:", e);
  }
}

// Fetch all resident service profiles from Supabase
export async function fetchResidentServicesFromSupabase(): Promise<ResidentServiceProfile[]> {
  try {
    const { data, error } = await supabase
      .from('resident_service_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("Aviso ao buscar perfis no Supabase:", error.message);
      return getLocalProfiles();
    }

    if (!data) {
      return getLocalProfiles();
    }

    const mappedProfiles: ResidentServiceProfile[] = data.map((row: any) => ({
      id: row.id,
      residentName: row.resident_name || row.residentName || '',
      residentBlock: row.resident_block || row.residentBlock || '',
      residentUnit: row.resident_unit || row.residentUnit || '',
      profession: row.profession || '',
      category: row.category || '',
      specialty: row.specialty || '',
      experience: row.experience || '',
      description: row.description || '',
      images: row.images || [],
      workHours: row.work_hours || row.workHours || '',
      startingPrice: Number(row.starting_price || row.startingPrice || 0),
      paymentMethods: row.payment_methods || row.paymentMethods || [],
      whatsapp: row.whatsapp || '',
      rating: Number(row.rating || 5.0),
      reviewCount: Number(row.review_count || row.reviewCount || 0),
      isActive: row.is_active !== undefined ? row.is_active : true,
      createdAt: row.created_at || row.createdAt,
    }));

    // Sincronizar cache local com o banco de dados
    if (mappedProfiles.length > 0) {
      saveLocalProfiles(mappedProfiles);
    }

    return mappedProfiles;
  } catch (err) {
    console.warn("Falha de conexão com o Supabase:", err);
    return getLocalProfiles();
  }
}

// Upload service profile images to Supabase storage bucket
export async function uploadServiceProfileImages(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i];
    try {
      const compressedFile = await compressImage(rawFile, 1200, 1200, 0.82);
      const fileExt = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `servico-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('imgs_anuncios')
        .upload(fileName, compressedFile, { cacheControl: '3600', upsert: false });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('imgs_anuncios').getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
          continue;
        }
      }
    } catch {
      // Fallback a base64 DataURL caso storage falhe
    }

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(rawFile);
    });
    uploadedUrls.push(base64);
  }

  return uploadedUrls;
}

// Create or update a resident service profile in Supabase
export async function saveResidentServiceProfileInSupabase(
  profileData: Omit<ResidentServiceProfile, 'id' | 'createdAt' | 'rating' | 'reviewCount'> & { id?: string }
): Promise<ResidentServiceProfile> {
  const isEditing = Boolean(profileData.id);
  const profileId = profileData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sp-${Date.now()}`);
  const now = new Date().toISOString();

  const newProfile: ResidentServiceProfile = {
    id: profileId,
    residentName: profileData.residentName,
    residentBlock: profileData.residentBlock || '',
    residentUnit: profileData.residentUnit,
    profession: profileData.profession,
    category: profileData.category,
    specialty: profileData.specialty || '',
    experience: profileData.experience || '',
    description: profileData.description,
    images: profileData.images,
    workHours: profileData.workHours || '',
    startingPrice: Number(profileData.startingPrice),
    paymentMethods: profileData.paymentMethods,
    whatsapp: profileData.whatsapp,
    rating: 5.0,
    reviewCount: 0,
    isActive: profileData.isActive ?? true,
    createdAt: now,
  };

  const payload = {
    id: profileId,
    resident_name: profileData.residentName,
    resident_block: profileData.residentBlock || '',
    resident_unit: profileData.residentUnit,
    profession: profileData.profession,
    category: profileData.category,
    specialty: profileData.specialty || '',
    experience: profileData.experience || '',
    description: profileData.description,
    images: profileData.images,
    work_hours: profileData.workHours || '',
    starting_price: profileData.startingPrice,
    payment_methods: profileData.paymentMethods,
    whatsapp: profileData.whatsapp,
    is_active: profileData.isActive ?? true,
  };

  try {
    const { error } = isEditing
      ? await supabase.from('resident_service_profiles').update(payload).eq('id', profileId)
      : await supabase.from('resident_service_profiles').insert([payload]);

    if (error) {
      console.error("Erro ao gravar perfil de serviço no Supabase:", error.message);
    }
  } catch (err) {
    console.error("Erro de conexão ao salvar no Supabase:", err);
  }

  // Atualizar cache local
  const currentLocals = getLocalProfiles();
  let updatedList: ResidentServiceProfile[];

  if (isEditing) {
    updatedList = currentLocals.map(p => p.id === profileId ? { ...p, ...newProfile, rating: p.rating, reviewCount: p.reviewCount } : p);
  } else {
    updatedList = [newProfile, ...currentLocals];
  }

  saveLocalProfiles(updatedList);
  return newProfile;
}

// Fetch reviews for a specific service profile from Supabase
export async function fetchServiceReviewsFromSupabase(profileId: string): Promise<ServiceReview[]> {
  try {
    const { data, error } = await supabase
      .from('service_reviews')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("Aviso ao buscar avaliações no Supabase:", error.message);
      return getLocalReviews().filter(r => r.profileId === profileId);
    }

    if (!data) {
      return getLocalReviews().filter(r => r.profileId === profileId);
    }

    return data.map((row: any) => ({
      id: row.id,
      profileId: row.profile_id || row.profileId,
      authorName: row.author_name || row.authorName || '',
      authorBlock: row.author_block || row.authorBlock || '',
      authorUnit: row.author_unit || row.authorUnit || '',
      rating: Number(row.rating || 5),
      comment: row.comment || '',
      createdAt: row.created_at || row.createdAt,
    }));
  } catch {
    return getLocalReviews().filter(r => r.profileId === profileId);
  }
}

// Add a review to a profile in Supabase and update average rating
export async function addServiceReviewInSupabase(
  profileId: string,
  review: Omit<ServiceReview, 'id' | 'profileId' | 'createdAt'>
): Promise<{ review: ServiceReview; newRating: number; newReviewCount: number }> {
  const reviewId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}`;
  const now = new Date().toISOString();

  const newReview: ServiceReview = {
    id: reviewId,
    profileId,
    authorName: review.authorName,
    authorBlock: review.authorBlock || '',
    authorUnit: review.authorUnit,
    rating: review.rating,
    comment: review.comment,
    createdAt: now,
  };

  try {
    const { error: insertErr } = await supabase.from('service_reviews').insert([{
      id: reviewId,
      profile_id: profileId,
      author_name: review.authorName,
      author_block: review.authorBlock || '',
      author_unit: review.authorUnit,
      rating: review.rating,
      comment: review.comment,
    }]);

    if (insertErr) {
      console.error("Erro ao gravar avaliação no Supabase:", insertErr.message);
    }
  } catch (err) {
    console.error("Erro de conexão ao enviar avaliação no Supabase:", err);
  }

  // Atualizar lista local de avaliações
  const localReviews = getLocalReviews();
  const updatedReviews = [newReview, ...localReviews];
  saveLocalReviews(updatedReviews);

  // Recalcular média de estrelas
  const profileReviews = updatedReviews.filter(r => r.profileId === profileId);
  const totalRatingSum = profileReviews.reduce((sum, r) => sum + r.rating, 0);
  const newReviewCount = profileReviews.length;
  const newRating = Number((totalRatingSum / newReviewCount).toFixed(1));

  // Atualizar perfil com a nova nota
  const localProfiles = getLocalProfiles();
  const updatedProfiles = localProfiles.map(p => {
    if (p.id === profileId) {
      return { ...p, rating: newRating, reviewCount: newReviewCount };
    }
    return p;
  });
  saveLocalProfiles(updatedProfiles);

  try {
    await supabase.from('resident_service_profiles').update({
      rating: newRating,
      review_count: newReviewCount
    }).eq('id', profileId);
  } catch {}

  return { review: newReview, newRating, newReviewCount };
}
