import { supabase } from './supabase';
import { ClassifiedItem, Coupon, ClassifiedStatus, CurrentUser } from '@/components/condo-market/types';
import { compressImage } from './imageCompression';

// ==========================================
// DESAPEGOS / CLASSIFIEDS (Bucket: imgs_anuncios)
// ==========================================

export async function fetchClassifiedsFromSupabase(): Promise<ClassifiedItem[]> {
  const { data, error } = await supabase
    .from('classifieds')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching classifieds from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    price: Number(row.price),
    category: row.category,
    images: row.images || [],
    status: (row.status as ClassifiedStatus) || 'available',
    createdAt: row.created_at,
    sellerName: row.seller_name,
    sellerBlock: row.seller_block || '',
    sellerUnit: row.seller_unit,
    whatsapp: row.whatsapp,
  }));
}

export async function uploadAnnouncementImages(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i];
    const compressedFile = await compressImage(rawFile, 1200, 1200, 0.82);

    const fileExt = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${i}.${fileExt}`;
    const filePath = `anuncio-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('imgs_anuncios')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error(`Error uploading image ${i + 1} to imgs_anuncios bucket:`, uploadError);
      throw new Error(`Falha ao fazer upload da imagem ${i + 1}. Verifique a conexão.`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('imgs_anuncios')
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      uploadedUrls.push(publicUrlData.publicUrl);
    }
  }

  return uploadedUrls;
}

export async function createClassifiedInSupabase(
  item: Omit<ClassifiedItem, 'id' | 'createdAt' | 'images'>,
  imageFiles: File[]
): Promise<ClassifiedItem> {
  if (!imageFiles || imageFiles.length === 0) {
    throw new Error('É obrigatório incluir pelo menos 1 foto no anúncio.');
  }

  if (imageFiles.length > 5) {
    throw new Error('O anúncio pode ter no máximo 5 fotos.');
  }

  // 1. Upload images to 'imgs_anuncios' bucket
  const imageUrls = await uploadAnnouncementImages(imageFiles);

  // 2. Insert into 'classifieds' table
  const { data, error } = await supabase
    .from('classifieds')
    .insert([
      {
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        images: imageUrls,
        status: item.status || 'available',
        seller_name: item.sellerName,
        seller_block: item.sellerBlock || null,
        seller_unit: item.sellerUnit,
        whatsapp: item.whatsapp,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting classified into Supabase:', error);
    throw new Error('Erro ao salvar anúncio no banco de dados.');
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    price: Number(data.price),
    category: data.category,
    images: data.images || [],
    status: data.status as ClassifiedStatus,
    createdAt: data.created_at,
    sellerName: data.seller_name,
    sellerBlock: data.seller_block || '',
    sellerUnit: data.seller_unit,
    whatsapp: data.whatsapp,
  };
}

export async function updateClassifiedStatusInSupabase(
  id: string,
  status: ClassifiedStatus
): Promise<boolean> {
  const { error } = await supabase
    .from('classifieds')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating status in Supabase:', error);
    return false;
  }
  return true;
}

// ==========================================
// PROMOÇÕES RELÂMPAGO (Bucket: img_ofertas)
// ==========================================

export async function fetchPromotionsFromSupabase(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promotions from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    merchantId: row.id,
    merchantName: row.merchant_name,
    merchantCategory: row.merchant_category,
    merchantWhatsapp: row.merchant_whatsapp,
    title: row.title,
    description: row.description || '',
    discountValue: row.discount_value,
    totalQuantity: row.total_quantity,
    remainingQuantity: row.remaining_quantity,
    expiresAt: row.expires_at,
    imageUrl: row.image_url || undefined,
    isActive: row.is_active ?? true,
  }));
}

export async function uploadOfferImage(file: File): Promise<string> {
  const compressedFile = await compressImage(file, 1200, 1200, 0.82);
  const fileExt = compressedFile.name.split('.').pop() || 'jpg';
  const fileName = `oferta-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('img_ofertas')
    .upload(fileName, compressedFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image to img_ofertas bucket:', uploadError);
    throw new Error('Falha ao fazer upload da imagem da oferta.');
  }

  const { data: publicUrlData } = supabase.storage
    .from('img_ofertas')
    .getPublicUrl(fileName);

  return publicUrlData?.publicUrl || '';
}

export async function createPromotionInSupabase(
  promotion: Omit<Coupon, 'id' | 'merchantId' | 'remainingQuantity' | 'isActive'> & {
    imageFile?: File | null;
  }
): Promise<Coupon> {
  let imageUrl = promotion.imageUrl || '';

  if (promotion.imageFile) {
    imageUrl = await uploadOfferImage(promotion.imageFile);
  }

  const { data, error } = await supabase
    .from('promotions')
    .insert([
      {
        merchant_name: promotion.merchantName,
        merchant_category: promotion.merchantCategory,
        merchant_whatsapp: promotion.merchantWhatsapp,
        title: promotion.title,
        description: promotion.description,
        discount_value: promotion.discountValue,
        total_quantity: promotion.totalQuantity,
        remaining_quantity: promotion.totalQuantity,
        expires_at: promotion.expiresAt,
        image_url: imageUrl || null,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting promotion into Supabase:', error);
    throw new Error('Erro ao salvar promoção no banco de dados.');
  }

  return {
    id: data.id,
    merchantId: data.id,
    merchantName: data.merchant_name,
    merchantCategory: data.merchant_category,
    merchantWhatsapp: data.merchant_whatsapp,
    title: data.title,
    description: data.description || '',
    discountValue: data.discount_value,
    totalQuantity: data.total_quantity,
    remainingQuantity: data.remaining_quantity,
    expiresAt: data.expires_at,
    imageUrl: data.image_url || undefined,
    isActive: data.is_active ?? true,
  };
}

export async function redeemPromotionInSupabase(id: string, currentRemaining: number): Promise<boolean> {
  const newRemaining = Math.max(0, currentRemaining - 1);
  const { error } = await supabase
    .from('promotions')
    .update({ remaining_quantity: newRemaining })
    .eq('id', id);

  if (error) {
    console.error('Error redeeming promotion in Supabase:', error);
    return false;
  }
  return true;
}

// ==========================================
// PERSISTÊNCIA DE MORADORES POR WHATSAPP
// ==========================================

const RESIDENTS_STORAGE_KEY = 'condo_market_residents_db';

export function getResidentByPhone(phone: string): CurrentUser | null {
  if (!phone) return null;
  const cleanPhone = phone.replace(/\D/g, '');
  try {
    const raw = localStorage.getItem(RESIDENTS_STORAGE_KEY);
    if (!raw) return null;
    const db: Record<string, CurrentUser> = JSON.parse(raw);
    return db[cleanPhone] || null;
  } catch (e) {
    console.error('Erro ao ler base de moradores local:', e);
    return null;
  }
}

export async function saveResidentProfile(resident: CurrentUser): Promise<void> {
  if (!resident.phone) return;
  const cleanPhone = resident.phone.replace(/\D/g, '');
  try {
    const raw = localStorage.getItem(RESIDENTS_STORAGE_KEY);
    const db: Record<string, CurrentUser> = raw ? JSON.parse(raw) : {};
    db[cleanPhone] = resident;
    localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Erro ao salvar morador no localStorage:', e);
  }

  // Tenta sincronizar também no Supabase (tabela profiles, se existir)
  try {
    await supabase.from('profiles').upsert([
      {
        phone: resident.phone,
        full_name: resident.name,
        block: resident.block,
        unit: resident.unit,
        updated_at: new Date().toISOString(),
      },
    ]);
  } catch (e) {
    // Falha graciosa caso a tabela profiles não esteja configurada com essas colunas
    console.log('Sincronização no Supabase ignorada:', e);
  }
}

