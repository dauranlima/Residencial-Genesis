import { supabase } from './supabase';
import { ResidentServiceProfile, ServiceReview } from '@/components/condo-market/types';
import { compressImage } from './imageCompression';

const STORAGE_KEY_PROFILES = 'condo_resident_service_profiles';
const STORAGE_KEY_REVIEWS = 'condo_resident_service_reviews';

// Perfis demonstrativos padrão para a vitrine inicial não ficar vazia
const INITIAL_DEMO_PROFILES: ResidentServiceProfile[] = [
  {
    id: "sp-1",
    residentName: "Maria Silva",
    residentBlock: "Torre 2",
    residentUnit: "Apt 401",
    profession: "Maquiadora",
    category: "Maquiadora",
    specialty: "Maquiagem social, noivas e madrinhas",
    experience: "6 anos no mercado de beleza",
    description: "Atendimento exclusivo no condomínio com horário flexível. Trabalho com produtos de altíssima qualidade e durabilidade para festas e eventos.",
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    workHours: "Terça a Sábado, 08h às 19h",
    startingPrice: 80,
    paymentMethods: ["PIX", "Cartão de Crédito", "Dinheiro"],
    whatsapp: "(45) 99911-2233",
    rating: 4.9,
    reviewCount: 32,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sp-2",
    residentName: "Carlos Eduardo",
    residentBlock: "Torre 1",
    residentUnit: "Apt 102",
    profession: "Técnico de informática",
    category: "Técnico de informática",
    specialty: "Manutenção de PCs, notebooks e Wi-Fi",
    experience: "10 anos em suporte de TI",
    description: "Resolvo lentidão no computador, formatação com backup seguro, montagem de PC Gamer e melhoria de rede Wi-Fi nos apartamentos.",
    images: [
      "https://images.unsplash.com/photo-1588702547919-26089e690ecd?w=600&auto=format&fit=crop&q=80"
    ],
    workHours: "Segunda a Sexta, 18h às 22h / Sábados o dia todo",
    startingPrice: 60,
    paymentMethods: ["PIX", "Dinheiro"],
    whatsapp: "(45) 99888-7766",
    rating: 5.0,
    reviewCount: 19,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sp-3",
    residentName: "Ana Paula de Souza",
    residentBlock: "Torre 3",
    residentUnit: "Apt 305",
    profession: "Pet sitter",
    category: "Pet sitter",
    specialty: "Passeios e cuidados de gatos e cães no condomínio",
    experience: "Apaixonada por animais com curso de Primeiros Socorros Pet",
    description: "Cuido do seu pet durante viagens ou passeios diários nas áreas permitidas. Envio fotos e vídeos atualizados em tempo real!",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80"
    ],
    workHours: "Todos os dias (inclusive finais de semana e feriados)",
    startingPrice: 35,
    paymentMethods: ["PIX"],
    whatsapp: "(45) 99777-1122",
    rating: 4.8,
    reviewCount: 24,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sp-4",
    residentName: "Roberto Ramos",
    residentBlock: "Torre 2",
    residentUnit: "Apt 603",
    profession: "Eletricista",
    category: "Eletricista",
    specialty: "Instalação de luminárias, chuveiros e tomadas",
    experience: "Eletrotécnico formado pelo SENAI",
    description: "Serviços rápidos e seguros para sua residência: troca de resistência, novos pontos de iluminação LED, disjuntores e quadros.",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80"
    ],
    workHours: "Segunda a Sábado, 08h às 18h",
    startingPrice: 50,
    paymentMethods: ["PIX", "Cartão de Débito", "Dinheiro"],
    whatsapp: "(45) 99666-4455",
    rating: 4.9,
    reviewCount: 41,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_DEMO_REVIEWS: ServiceReview[] = [
  {
    id: "rev-1",
    profileId: "sp-1",
    authorName: "Juliana Santos",
    authorBlock: "Torre 1",
    authorUnit: "Apt 204",
    rating: 5,
    comment: "Excelente profissional! Fez minha maquiagem para um casamento e durou a festa inteira. Muito pontual e caprichosa.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "rev-2",
    profileId: "sp-1",
    authorName: "Patricia Lima",
    authorBlock: "Torre 2",
    authorUnit: "Apt 502",
    rating: 5,
    comment: "Adorei o atendimento no meu próprio apartamento. Super recomendada para quem mora no condomínio!",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "rev-3",
    profileId: "sp-2",
    authorName: "Fernando Costa",
    authorBlock: "Torre 3",
    authorUnit: "Apt 101",
    rating: 5,
    comment: "Resolveu o problema da minha rede Wi-Fi no mesmo dia. Rápido, honesto e preço muito justo.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

function getLocalProfiles(): ResidentServiceProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_DEMO_PROFILES));
      return INITIAL_DEMO_PROFILES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_PROFILES;
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
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_DEMO_REVIEWS));
      return INITIAL_DEMO_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_REVIEWS;
  }
}

function saveLocalReviews(reviews: ServiceReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error("Erro ao salvar avaliações locais:", e);
  }
}

// Fetch all service profiles
export async function fetchResidentServicesFromSupabase(): Promise<ResidentServiceProfile[]> {
  try {
    const { data, error } = await supabase
      .from('resident_service_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalProfiles();
    }

    return data.map((row: any) => ({
      id: row.id,
      residentName: row.resident_name || row.residentName,
      residentBlock: row.resident_block || row.residentBlock || '',
      residentUnit: row.resident_unit || row.residentUnit,
      profession: row.profession,
      category: row.category,
      specialty: row.specialty || '',
      experience: row.experience || '',
      description: row.description || '',
      images: row.images || [],
      workHours: row.work_hours || row.workHours || '',
      startingPrice: Number(row.starting_price || row.startingPrice || 0),
      paymentMethods: row.payment_methods || row.paymentMethods || [],
      whatsapp: row.whatsapp,
      rating: Number(row.rating || 5.0),
      reviewCount: Number(row.review_count || row.reviewCount || 0),
      isActive: row.is_active !== undefined ? row.is_active : true,
      createdAt: row.created_at || row.createdAt,
    }));
  } catch {
    return getLocalProfiles();
  }
}

// Upload service profile images
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
      // Fallback a base64 DataURL
    }

    // Base64 Fallback
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(rawFile);
    });
    uploadedUrls.push(base64);
  }

  return uploadedUrls;
}

// Create or update a resident service profile
export async function saveResidentServiceProfileInSupabase(
  profileData: Omit<ResidentServiceProfile, 'id' | 'createdAt' | 'rating' | 'reviewCount'> & { id?: string }
): Promise<ResidentServiceProfile> {
  const isEditing = Boolean(profileData.id);
  const profileId = profileData.id || `sp-${Date.now()}`;
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

  // Try Supabase first
  try {
    const payload = {
      id: profileId,
      resident_name: profileData.residentName,
      resident_block: profileData.residentBlock,
      resident_unit: profileData.residentUnit,
      profession: profileData.profession,
      category: profileData.category,
      specialty: profileData.specialty,
      experience: profileData.experience,
      description: profileData.description,
      images: profileData.images,
      work_hours: profileData.workHours,
      starting_price: profileData.startingPrice,
      payment_methods: profileData.paymentMethods,
      whatsapp: profileData.whatsapp,
      is_active: profileData.isActive ?? true,
    };

    const { error } = isEditing
      ? await supabase.from('resident_service_profiles').update(payload).eq('id', profileId)
      : await supabase.from('resident_service_profiles').insert([payload]);

    if (error) {
      console.warn("Supabase profile save notice, keeping local sync:", error.message);
    }
  } catch (err) {
    console.warn("Supabase connection notice, using local storage:", err);
  }

  // Update local storage
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

// Fetch reviews for a specific service profile
export async function fetchServiceReviewsFromSupabase(profileId: string): Promise<ServiceReview[]> {
  try {
    const { data, error } = await supabase
      .from('service_reviews')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalReviews().filter(r => r.profileId === profileId);
    }

    return data.map((row: any) => ({
      id: row.id,
      profileId: row.profile_id || row.profileId,
      authorName: row.author_name || row.authorName,
      authorBlock: row.author_block || row.authorBlock || '',
      authorUnit: row.author_unit || row.authorUnit,
      rating: Number(row.rating),
      comment: row.comment,
      createdAt: row.created_at || row.createdAt,
    }));
  } catch {
    return getLocalReviews().filter(r => r.profileId === profileId);
  }
}

// Add a review to a profile and update average rating
export async function addServiceReviewInSupabase(
  profileId: string,
  review: Omit<ServiceReview, 'id' | 'profileId' | 'createdAt'>
): Promise<{ review: ServiceReview; newRating: number; newReviewCount: number }> {
  const reviewId = `rev-${Date.now()}`;
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

  // Try Supabase insert
  try {
    await supabase.from('service_reviews').insert([{
      id: reviewId,
      profile_id: profileId,
      author_name: review.authorName,
      author_block: review.authorBlock,
      author_unit: review.authorUnit,
      rating: review.rating,
      comment: review.comment,
    }]);
  } catch (err) {
    console.warn("Supabase review notice:", err);
  }

  // Update local reviews list
  const localReviews = getLocalReviews();
  const updatedReviews = [newReview, ...localReviews];
  saveLocalReviews(updatedReviews);

  // Recalculate average rating for this profile
  const profileReviews = updatedReviews.filter(r => r.profileId === profileId);
  const totalRatingSum = profileReviews.reduce((sum, r) => sum + r.rating, 0);
  const newReviewCount = profileReviews.length;
  const newRating = Number((totalRatingSum / newReviewCount).toFixed(1));

  // Update profile with new rating/reviewCount in local storage
  const localProfiles = getLocalProfiles();
  const updatedProfiles = localProfiles.map(p => {
    if (p.id === profileId) {
      return { ...p, rating: newRating, reviewCount: newReviewCount };
    }
    return p;
  });
  saveLocalProfiles(updatedProfiles);

  // Try updating Supabase profile rating
  try {
    await supabase.from('resident_service_profiles').update({
      rating: newRating,
      review_count: newReviewCount
    }).eq('id', profileId);
  } catch {}

  return { review: newReview, newRating, newReviewCount };
}
