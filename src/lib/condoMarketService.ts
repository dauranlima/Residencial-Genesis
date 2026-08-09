import { supabase } from './supabase';
import { ClassifiedItem, Coupon, ClassifiedStatus, CurrentUser, DatabaseCouponRedemption, AdminUser } from '@/components/condo-market/types';
import { compressImage } from './imageCompression';

// ==========================================
// DESAPEGOS / CLASSIFIEDS (Bucket: imgs_anuncios)
// ==========================================

export async function fetchClassifiedsFromSupabase(): Promise<ClassifiedItem[]> {
  const { data, error } = await supabase
    .from('classifieds')
    .select('id, title, description, price, category, images, status, created_at, seller_name, seller_block, seller_unit, whatsapp')
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

export async function updateClassifiedInSupabase(
  id: string,
  updatedData: Omit<ClassifiedItem, 'id' | 'createdAt' | 'images'>,
  existingImages: string[],
  newFiles: File[]
): Promise<ClassifiedItem> {
  const totalPhotos = existingImages.length + newFiles.length;
  if (totalPhotos === 0) {
    throw new Error('É obrigatório incluir pelo menos 1 foto no anúncio.');
  }

  if (totalPhotos > 5) {
    throw new Error('O anúncio pode ter no máximo 5 fotos.');
  }

  // 1. Upload das novas imagens caso existam
  let uploadedUrls: string[] = [];
  if (newFiles.length > 0) {
    uploadedUrls = await uploadAnnouncementImages(newFiles);
  }

  const finalImages = [...existingImages, ...uploadedUrls];

  // 2. Atualizar registro na tabela 'classifieds'
  const { data, error } = await supabase
    .from('classifieds')
    .update({
      title: updatedData.title,
      price: updatedData.price,
      description: updatedData.description,
      category: updatedData.category,
      images: finalImages,
      status: updatedData.status || 'available',
      seller_name: updatedData.sellerName,
      seller_block: updatedData.sellerBlock || null,
      seller_unit: updatedData.sellerUnit,
      whatsapp: updatedData.whatsapp,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating classified in Supabase:', error);
    throw new Error('Erro ao atualizar o anúncio no banco de dados.');
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

export async function deleteClassifiedInSupabase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('classifieds')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting classified from Supabase:', error);
    throw new Error(`Falha ao excluir anúncio: ${error.message}`);
  }
  return true;
}


// ==========================================
// PROMOÇÕES RELÂMPAGO (Bucket: img_ofertas)
// ==========================================

export async function fetchPromotionsFromSupabase(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select('id, merchant_name, merchant_category, merchant_whatsapp, title, description, discount_value, total_quantity, remaining_quantity, expires_at, image_url, is_active')
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

export async function deletePromotionInSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir promoção do Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Falha ao excluir promoção:', e);
    return false;
  }
}

export async function fetchUserRedeemedCouponIdsFromSupabase(phone: string): Promise<string[]> {
  if (!phone) return [];
  const cleanPhone = phone.replace(/\D/g, '');
  
  try {
    const { data, error } = await supabase
      .from('coupon_redemptions')
      .select('coupon_id, resident_phone');

    if (error) {
      console.warn('Consulta na tabela coupon_redemptions no Supabase:', error);
      return [];
    }

    const matches = (data || []).filter((row: any) => {
      const rPhone = (row.resident_phone || '').replace(/\D/g, '');
      return rPhone === cleanPhone || rPhone.endsWith(cleanPhone) || cleanPhone.endsWith(rPhone);
    });

    return matches.map((m: any) => m.coupon_id);
  } catch (e) {
    console.error('Erro ao carregar cupons resgatados do Supabase:', e);
    return [];
  }
}

export async function fetchCouponRedemptionsForMerchant(
  couponId?: string
): Promise<DatabaseCouponRedemption[]> {
  try {
    let query = supabase
      .from('coupon_redemptions')
      .select('id, coupon_id, resident_name, resident_phone, resident_unit, resident_block, redeemed_at')
      .order('redeemed_at', { ascending: false });

    if (couponId) {
      query = query.eq('coupon_id', couponId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Erro ao consultar a tabela coupon_redemptions no Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      couponId: row.coupon_id,
      residentName: row.resident_name,
      residentPhone: row.resident_phone,
      residentUnit: row.resident_unit,
      residentBlock: row.resident_block || '',
      redeemedAt: row.redeemed_at,
    }));
  } catch (e) {
    console.error('Falha ao buscar resgates para comerciante:', e);
    return [];
  }
}

export async function fetchTotalRedemptionsCountFromSupabase(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('coupon_redemptions')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.warn('Tabela coupon_redemptions sem contagem:', error);
      return 0;
    }

    return count || 0;
  } catch (e) {
    console.error('Erro ao buscar total de resgates no Supabase:', e);
    return 0;
  }
}

const MERCHANTS_STORAGE_KEY = 'condo_market_merchants_db';

export async function createMerchantInSupabase(
  merchant: Omit<Merchant, 'id'>
): Promise<Merchant> {
  // 1. Tentar gravar diretamente no Supabase como banco de dados principal
  const { data, error } = await supabase
    .from('merchants')
    .insert([
      {
        business_name: merchant.businessName,
        category: merchant.category,
        responsible_name: merchant.responsibleName || null,
        phone: merchant.whatsapp,
        address: merchant.address || null,
        access_code: merchant.accessCode,
        description: merchant.description || null,
        logo_url: merchant.logoUrl || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar parceiro comercial no Supabase:', error);
    throw new Error(`Falha ao salvar no banco de dados Supabase: ${error.message || error.details || 'Verifique se a tabela "merchants" foi criada.'}`);
  }

  const createdMerchant: Merchant = {
    id: data.id,
    businessName: data.business_name,
    category: data.category,
    responsibleName: data.responsible_name || '',
    whatsapp: data.phone || merchant.whatsapp,
    address: data.address || '',
    accessCode: data.access_code || merchant.accessCode,
    description: data.description || '',
    logoUrl: data.logo_url || '',
  };

  // 2. Atualizar cache local no LocalStorage
  try {
    const raw = localStorage.getItem(MERCHANTS_STORAGE_KEY);
    const localMerchants: Merchant[] = raw ? JSON.parse(raw) : [];
    const updated = [createdMerchant, ...localMerchants.filter((m) => m.id !== createdMerchant.id)];
    localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Aviso ao sincronizar cache local:', e);
  }

  return createdMerchant;
}

export async function getMerchantByAccessCode(code: string): Promise<Merchant | null> {
  if (!code) return null;
  const cleanCode = code.trim();

  // 1. Consultar prioritariamente no Supabase
  try {
    const { data, error } = await supabase
      .from('merchants')
      .select('id, business_name, category, responsible_name, phone, address, access_code, description, logo_url')
      .eq('access_code', cleanCode)
      .limit(1);

    if (!error && data && data.length > 0) {
      const m = data[0];
      return {
        id: m.id,
        businessName: m.business_name || m.businessName,
        category: m.category,
        responsibleName: m.responsible_name || '',
        whatsapp: m.phone || m.whatsapp || '',
        address: m.address || '',
        accessCode: m.access_code || cleanCode,
        description: m.description || '',
        logoUrl: m.logo_url || '',
      };
    }
  } catch (e) {
    console.error('Erro ao buscar comerciante por código no Supabase:', e);
  }

  // 2. Fallback de contingência para localStorage se offline
  try {
    const raw = localStorage.getItem(MERCHANTS_STORAGE_KEY);
    if (raw) {
      const localList: Merchant[] = JSON.parse(raw);
      const match = localList.find((m) => m.accessCode === cleanCode);
      if (match) return match;
    }
  } catch (e) {
    console.error('Erro ao ler merchants no localStorage:', e);
  }

  return null;
}

export async function fetchMerchantsFromSupabase(): Promise<Merchant[]> {
  const resultMerchants: Merchant[] = [];
  const addedIds = new Set<string>();

  try {
    // 1. Buscar da tabela 'merchants' no Supabase (Fonte Principal)
    const { data: merchantsData, error: merchantsErr } = await supabase
      .from('merchants')
      .select('id, business_name, category, responsible_name, description, address, phone, logo_url, access_code')
      .order('created_at', { ascending: false });

    if (!merchantsErr && merchantsData && merchantsData.length > 0) {
      merchantsData.forEach((m: any) => {
        if (!addedIds.has(m.id)) {
          addedIds.add(m.id);
          resultMerchants.push({
            id: m.id,
            businessName: m.business_name || m.businessName,
            category: m.category,
            responsibleName: m.responsible_name || '',
            description: m.description || '',
            address: m.address || '',
            whatsapp: m.phone || m.whatsapp || '',
            accessCode: m.access_code || '',
            logoUrl: m.logo_url || '',
          });
        }
      });
    }

    // 2. Complementar com parceiros extraídos dos anúncios de promoções se não estiverem na lista
    const { data: promotionsData } = await supabase
      .from('promotions')
      .select('merchant_name, merchant_category, merchant_whatsapp, description');

    if (promotionsData && promotionsData.length > 0) {
      promotionsData.forEach((p: any, idx: number) => {
        const name = p.merchant_name || 'Comércio Local';
        const exists = resultMerchants.some((m) => m.businessName.toLowerCase() === name.toLowerCase());
        if (!exists) {
          const promoMerchantId = `m-db-${idx}`;
          if (!addedIds.has(promoMerchantId)) {
            addedIds.add(promoMerchantId);
            resultMerchants.push({
              id: promoMerchantId,
              businessName: name,
              category: p.merchant_category || 'Geral',
              description: p.description || 'Parceiro comercial do condomínio',
              whatsapp: p.merchant_whatsapp || '',
            });
          }
        }
      });
    }
  } catch (e) {
    console.error('Erro ao buscar comerciantes do Supabase:', e);
  }

  // 3. Fallback offline: apenas se o banco de dados não retornar nada
  if (resultMerchants.length === 0) {
    try {
      const raw = localStorage.getItem(MERCHANTS_STORAGE_KEY);
      if (raw) {
        const localList: Merchant[] = JSON.parse(raw);
        localList.forEach((m) => {
          if (!addedIds.has(m.id)) {
            addedIds.add(m.id);
            resultMerchants.push(m);
          }
        });
      }
    } catch (_e) {}
  }

  return resultMerchants;
}

/**
 * Busca TODOS os parceiros com detalhes de PIN para a Central do Super Admin
 */
export async function fetchAllMerchantsForAdmin(): Promise<Merchant[]> {
  const resultMerchants: Merchant[] = [];
  const addedIds = new Set<string>();

  // 1. Buscar da tabela 'merchants' no Supabase INCLUINDO access_code
  try {
    const { data: merchantsData, error: merchantsErr } = await supabase
      .from('merchants')
      .select('id, business_name, category, responsible_name, description, address, phone, access_code, logo_url')
      .order('created_at', { ascending: false });

    if (merchantsErr) {
      console.error('Erro de consulta Supabase (fetchAllMerchantsForAdmin):', merchantsErr);
    } else if (merchantsData && merchantsData.length > 0) {
      merchantsData.forEach((m: any) => {
        if (!addedIds.has(m.id)) {
          addedIds.add(m.id);
          resultMerchants.push({
            id: m.id,
            businessName: m.business_name || m.businessName,
            category: m.category,
            responsibleName: m.responsible_name || '',
            description: m.description || '',
            address: m.address || '',
            whatsapp: m.phone || m.whatsapp || '',
            accessCode: m.access_code || '',
            logoUrl: m.logo_url || '',
          });
        }
      });
    }
  } catch (e) {
    console.error('Erro ao buscar comerciantes para Super Admin:', e);
  }

  // 2. Se o Supabase não retornar registros, verificar cache local como contingência
  if (resultMerchants.length === 0) {
    try {
      const raw = localStorage.getItem(MERCHANTS_STORAGE_KEY);
      if (raw) {
        const localList: Merchant[] = JSON.parse(raw);
        localList.forEach((m) => {
          if (!addedIds.has(m.id)) {
            addedIds.add(m.id);
            resultMerchants.push(m);
          }
        });
      }
    } catch (_e) {}
  }

  return resultMerchants;
}

export async function updateMerchantInSupabase(
  id: string,
  updates: Partial<Merchant>
): Promise<boolean> {
  const payload: any = {};
  if (updates.businessName !== undefined) payload.business_name = updates.businessName;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.responsibleName !== undefined) payload.responsible_name = updates.responsibleName;
  if (updates.whatsapp !== undefined) payload.phone = updates.whatsapp;
  if (updates.address !== undefined) payload.address = updates.address;
  if (updates.accessCode !== undefined) payload.access_code = updates.accessCode;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.logoUrl !== undefined) payload.logo_url = updates.logoUrl;

  const { error } = await supabase
    .from('merchants')
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar parceiro no Supabase:', error);
    throw new Error(`Falha ao atualizar parceiro no Supabase: ${error.message}`);
  }

  // Atualizar cache local no localStorage
  try {
    const raw = localStorage.getItem(MERCHANTS_STORAGE_KEY);
    if (raw) {
      let localList: Merchant[] = JSON.parse(raw);
      localList = localList.map((m) => (m.id === id ? { ...m, ...updates } : m));
      localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(localList));
    }
  } catch (_e) {}

  return true;
}

export async function deleteMerchantFromSupabase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('merchants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar parceiro no Supabase:', error);
    throw new Error(`Falha ao excluir parceiro no Supabase: ${error.message}`);
  }

  // Remover do cache local
  try {
    const raw = localStorage.getItem(MERCHANTS_STORAGE_KEY);
    if (raw) {
      let localList: Merchant[] = JSON.parse(raw);
      localList = localList.filter((m) => m.id !== id);
      localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(localList));
    }
  } catch (_e) {}

  return true;
}

export async function regenerateMerchantAccessCode(id: string): Promise<string> {
  const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
  await updateMerchantInSupabase(id, { accessCode: newCode });
  return newCode;
}

export async function redeemPromotionInSupabase(
  id: string,
  currentRemaining: number,
  resident?: CurrentUser | null
): Promise<boolean> {
  const newRemaining = Math.max(0, currentRemaining - 1);

  // 1. Decrementar quantidade disponível na tabela 'promotions'
  const { error: updateErr } = await supabase
    .from('promotions')
    .update({ remaining_quantity: newRemaining })
    .eq('id', id);

  if (updateErr) {
    console.error('Error updating promotion remaining quantity in Supabase:', updateErr);
  }

  // 2. Gravar vínculo de resgate na tabela 'coupon_redemptions' (moradora x cupom)
  if (resident) {
    try {
      const { error: insertErr } = await supabase
        .from('coupon_redemptions')
        .insert([
          {
            coupon_id: id,
            resident_name: resident.name,
            resident_phone: resident.phone,
            resident_unit: resident.unit,
            resident_block: resident.block || null,
          },
        ]);

      if (insertErr) {
        console.warn('Aviso ao registrar resgate na tabela coupon_redemptions:', insertErr);
      }
    } catch (e) {
      console.error('Falha ao registrar resgate em coupon_redemptions:', e);
    }
  }

  return true;
}

// ==========================================
// PERSISTÊNCIA DE MORADORES POR WHATSAPP (100% SUPABASE LIVE)
// ==========================================

/**
 * Gera todas as variações possíveis de formato para um número de telefone
 */
function getPhoneSearchVariations(phone: string): { phoneWithout55: string; cleanDigits: string; variations: string[] } {
  const cleanDigits = (phone || '').replace(/\D/g, '');
  if (!cleanDigits) return { phoneWithout55: '', cleanDigits: '', variations: [] };

  const phoneWithout55 = cleanDigits.startsWith('55') && cleanDigits.length > 11
    ? cleanDigits.slice(2)
    : cleanDigits;

  const phoneWith55 = `55${phoneWithout55}`;
  const phoneWithPlus55 = `+55${phoneWithout55}`;

  let f1 = phoneWithout55;
  let f2 = phoneWithout55;
  let f3 = phoneWithout55;
  if (phoneWithout55.length === 11) {
    const ddd = phoneWithout55.slice(0, 2);
    const part1 = phoneWithout55.slice(2, 7);
    const part2 = phoneWithout55.slice(7);
    f1 = `(${ddd}) ${part1}-${part2}`; // (45) 99984-8841
    f2 = `(${ddd}) ${part1}${part2}`;  // (45) 999848841
    f3 = `${ddd} ${part1}-${part2}`;   // 45 99984-8841
  } else if (phoneWithout55.length === 10) {
    const ddd = phoneWithout55.slice(0, 2);
    const part1 = phoneWithout55.slice(2, 6);
    const part2 = phoneWithout55.slice(6);
    f1 = `(${ddd}) ${part1}-${part2}`;
    f2 = `(${ddd}) ${part1}${part2}`;
    f3 = `${ddd} ${part1}-${part2}`;
  }

  const list = [
    phone.trim(),
    cleanDigits,
    phoneWithout55,
    phoneWith55,
    phoneWithPlus55,
    f1,
    f2,
    f3,
    `+55 ${f1}`,
    `+55${f1}`,
  ];

  return {
    phoneWithout55,
    cleanDigits,
    variations: Array.from(new Set(list)).filter(Boolean),
  };
}

export async function getResidentByPhone(phone: string): Promise<CurrentUser | null> {
  if (!phone) return null;
  const { phoneWithout55, variations } = getPhoneSearchVariations(phone);
  if (!phoneWithout55) return null;

  // Helper para verificar se um telefone no DB corresponde ao informado
  const isMatch = (dbPhone?: string | null): boolean => {
    if (!dbPhone) return false;
    const dbClean = dbPhone.replace(/\D/g, '');
    return dbClean.endsWith(phoneWithout55) || phoneWithout55.endsWith(dbClean);
  };

  // 1. Busca DIRETA na tabela 'users' do Supabase
  try {
    let { data: usersData, error: uErr } = await supabase
      .from('users')
      .select('name, block, unit, phone, is_blocked')
      .in('phone', variations);

    if (uErr) {
      console.warn('Aviso na busca por .in em users:', uErr);
    }

    // 1b. Fallback ilike com os últimos 4 dígitos
    if (!usersData || usersData.length === 0) {
      const last4 = phoneWithout55.slice(-4);
      const { data: ilikeUsers } = await supabase
        .from('users')
        .select('name, block, unit, phone, is_blocked')
        .ilike('phone', `%${last4}%`);
      usersData = ilikeUsers;
    }

    // 1c. Fallback universal: leitura completa da tabela users para normalização de dígitos em JS
    if (!usersData || usersData.length === 0) {
      const { data: allUsers } = await supabase
        .from('users')
        .select('name, block, unit, phone, is_blocked');
      usersData = allUsers;
    }

    if (usersData && usersData.length > 0) {
      const match = usersData.find((u) => isMatch(u.phone));
      if (match) {
        console.log('[ResidentDB - Supabase Live] Encontrado na tabela users:', match.name);
        return {
          name: match.name || 'Morador',
          block: match.block || '',
          unit: match.unit || 'Sem Apto',
          phone: match.phone || phone,
          isBlocked: match.is_blocked ?? false,
        };
      }
    }
  } catch (e) {
    console.warn('Consulta na tabela users no Supabase ignorada:', e);
  }

  // 2. Busca DIRETA na tabela 'classifieds' do Supabase
  try {
    let { data: exactClassifieds } = await supabase
      .from('classifieds')
      .select('seller_name, seller_block, seller_unit, whatsapp')
      .in('whatsapp', variations);

    if (!exactClassifieds || exactClassifieds.length === 0) {
      const last4 = phoneWithout55.slice(-4);
      const { data: ilikeClassifieds } = await supabase
        .from('classifieds')
        .select('seller_name, seller_block, seller_unit, whatsapp')
        .ilike('whatsapp', `%${last4}%`);
      exactClassifieds = ilikeClassifieds;
    }

    if (!exactClassifieds || exactClassifieds.length === 0) {
      const { data: allClassifieds } = await supabase
        .from('classifieds')
        .select('seller_name, seller_block, seller_unit, whatsapp');
      exactClassifieds = allClassifieds;
    }

    if (exactClassifieds && exactClassifieds.length > 0) {
      const c = exactClassifieds.find((item) => isMatch(item.whatsapp));
      if (c) {
        console.log('[ResidentDB - Supabase Live] Encontrado na tabela classifieds:', c.seller_name);
        return {
          name: c.seller_name || 'Morador',
          block: c.seller_block || '',
          unit: c.seller_unit || 'Sem Apto',
          phone: c.whatsapp || phone,
        };
      }
    }
  } catch (e) {
    console.error('Erro ao buscar morador nos anúncios do Supabase:', e);
  }

  // 3. Busca DIRETA na tabela 'profiles' do Supabase
  try {
    let { data: profiles } = await supabase
      .from('profiles')
      .select('full_name, block, unit, phone')
      .in('phone', variations);

    if (!profiles || profiles.length === 0) {
      const last4 = phoneWithout55.slice(-4);
      const { data: ilikeProfiles } = await supabase
        .from('profiles')
        .select('full_name, block, unit, phone')
        .ilike('phone', `%${last4}%`);
      profiles = ilikeProfiles;
    }

    if (!profiles || profiles.length === 0) {
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('full_name, block, unit, phone');
      profiles = allProfiles;
    }

    if (profiles && profiles.length > 0) {
      const match = profiles.find((p) => isMatch(p.phone));
      if (match) {
        console.log('[ResidentDB - Supabase Live] Encontrado na tabela profiles:', match.full_name);
        return {
          name: match.full_name || 'Morador',
          block: match.block || '',
          unit: match.unit || 'Sem Apto',
          phone: match.phone || phone,
        };
      }
    }
  } catch (e) {
    console.log('Consulta na tabela profiles no Supabase ignorada:', e);
  }

  return null;
}

export async function saveResidentProfile(resident: CurrentUser): Promise<void> {
  if (!resident.phone) return;
  const { phoneWithout55 } = getPhoneSearchVariations(resident.phone);
  if (!phoneWithout55) return;

  const phoneWith55 = `55${phoneWithout55}`;

  // 1. Salvar DIRETO na tabela 'users' no Supabase
  try {
    const { error: userError } = await supabase
      .from('users')
      .upsert(
        [
          {
            name: resident.name,
            phone: resident.phone,
            block: resident.block || null,
            unit: resident.unit,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'phone' }
      );

    if (userError) {
      console.warn('Aviso ao salvar morador na tabela users no Supabase:', userError);
      // Tentar salvar com formato DDI 55
      await supabase.from('users').upsert([
        {
          name: resident.name,
          phone: phoneWith55,
          block: resident.block || null,
          unit: resident.unit,
          updated_at: new Date().toISOString(),
        },
      ]);
    } else {
      console.log('Morador salvo com sucesso na tabela users do Supabase!');
    }
  } catch (e) {
    console.error('Erro ao salvar morador no Supabase:', e);
  }

  // 2. Salvar DIRETO na tabela 'profiles' caso configurada
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
  } catch (_e) {}
}

// ==========================================
// MÓDULO DE GESTÃO DE MORADORES (SUPER ADMIN)
// ==========================================

export async function fetchAllUsersForAdmin(): Promise<AdminUser[]> {
  const usersMap = new Map<string, AdminUser>();

  const cleanDigits = (p?: string | null) => (p || '').replace(/\D/g, '');

  // 1. Carregar anúncios para calcular contagem por morador
  let classifiedsData: any[] = [];
  try {
    const { data: cData } = await supabase
      .from('classifieds')
      .select('id, seller_name, seller_block, seller_unit, whatsapp, created_at');
    if (cData) classifiedsData = cData;
  } catch (e) {
    console.warn('Aviso ao carregar anúncios para contagem:', e);
  }

  // 2. Carregar registros da tabela 'users'
  try {
    const { data: usersData, error } = await supabase
      .from('users')
      .select('id, name, phone, block, unit, is_blocked, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (!error && usersData) {
      usersData.forEach((u: any) => {
        const phoneClean = cleanDigits(u.phone);
        const count = classifiedsData.filter((c: any) => {
          const cPhone = cleanDigits(c.whatsapp);
          return cPhone && (cPhone === phoneClean || cPhone.endsWith(phoneClean) || phoneClean.endsWith(cPhone));
        }).length;

        const key = phoneClean || u.id;
        usersMap.set(key, {
          id: u.id,
          name: u.name || 'Morador',
          phone: u.phone || '',
          block: u.block || '',
          unit: u.unit || '',
          isBlocked: u.is_blocked ?? false,
          createdAt: u.created_at,
          updatedAt: u.updated_at,
          announcementsCount: count,
        });
      });
    }
  } catch (e) {
    console.error('Erro ao buscar usuários da tabela users:', e);
  }

  // 3. Incluir moradores que postaram anúncios mas ainda não constam na tabela 'users'
  classifiedsData.forEach((c: any, idx: number) => {
    const phoneClean = cleanDigits(c.whatsapp);
    if (phoneClean && !usersMap.has(phoneClean)) {
      const count = classifiedsData.filter((item: any) => {
        const itemPhone = cleanDigits(item.whatsapp);
        return itemPhone === phoneClean || itemPhone.endsWith(phoneClean) || phoneClean.endsWith(itemPhone);
      }).length;

      usersMap.set(phoneClean, {
        id: `usr-class-${idx}`,
        name: c.seller_name || 'Morador Anunciante',
        phone: c.whatsapp || '',
        block: c.seller_block || '',
        unit: c.seller_unit || '',
        isBlocked: false,
        createdAt: c.created_at,
        announcementsCount: count,
      });
    }
  });

  return Array.from(usersMap.values());
}

export async function toggleBlockUserInSupabase(phoneOrId: string, isBlocked: boolean): Promise<boolean> {
  const cleanPhone = phoneOrId.replace(/\D/g, '');

  // 1. Tentar atualizar diretamente na tabela 'users' por ID ou telefone
  const { data: usersData } = await supabase
    .from('users')
    .select('id, phone')
    .or(`id.eq.${phoneOrId},phone.eq.${phoneOrId}`);

  if (usersData && usersData.length > 0) {
    for (const u of usersData) {
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: isBlocked, updated_at: new Date().toISOString() })
        .eq('id', u.id);

      if (error) throw new Error(`Falha ao atualizar bloqueio: ${error.message}`);
    }
    return true;
  }

  // 2. Se a busca por igualdade direta falhou, tentar por telefone limpo
  if (cleanPhone) {
    const { data: phoneUsers } = await supabase
      .from('users')
      .select('id, phone')
      .ilike('phone', `%${cleanPhone.slice(-8)}%`);

    if (phoneUsers && phoneUsers.length > 0) {
      for (const u of phoneUsers) {
        await supabase
          .from('users')
          .update({ is_blocked: isBlocked, updated_at: new Date().toISOString() })
          .eq('id', u.id);
      }
      return true;
    }
  }

  // 3. Se o morador veio dos anúncios e ainda não tinha registro em 'users', registrar agora com o status de bloqueio
  const { data: cData } = await supabase
    .from('classifieds')
    .select('seller_name, seller_block, seller_unit, whatsapp')
    .ilike('whatsapp', `%${cleanPhone.slice(-8)}%`)
    .limit(1);

  if (cData && cData.length > 0) {
    const c = cData[0];
    const { error } = await supabase.from('users').upsert([
      {
        name: c.seller_name || 'Morador',
        phone: c.whatsapp || phoneOrId,
        block: c.seller_block || null,
        unit: c.seller_unit || 'Sem Apto',
        is_blocked: isBlocked,
        updated_at: new Date().toISOString(),
      },
    ], { onConflict: 'phone' });

    if (error) throw new Error(`Erro ao registrar morador para bloqueio: ${error.message}`);
  } else {
    // Se não tinha anúncio nem user, registrar por telefone
    const { error } = await supabase.from('users').upsert([
      {
        name: 'Morador',
        phone: phoneOrId,
        block: null,
        unit: 'Sem Apto',
        is_blocked: isBlocked,
        updated_at: new Date().toISOString(),
      },
    ], { onConflict: 'phone' });

    if (error) throw new Error(`Erro ao registrar usuário: ${error.message}`);
  }

  return true;
}

export async function fetchClassifiedsByUserPhone(phone: string): Promise<ClassifiedItem[]> {
  if (!phone) return [];
  const cleanPhone = phone.replace(/\D/g, '');

  const { data, error } = await supabase
    .from('classifieds')
    .select('id, title, description, price, category, images, status, created_at, seller_name, seller_block, seller_unit, whatsapp')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data
    .filter((row: any) => {
      const rPhone = (row.whatsapp || '').replace(/\D/g, '');
      return rPhone === cleanPhone || rPhone.endsWith(cleanPhone) || cleanPhone.endsWith(rPhone);
    })
    .map((row: any) => ({
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

export async function updateUserProfileInSupabase(
  userId: string,
  updates: { name?: string; block?: string; unit?: string; phone?: string }
): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({
      ...(updates.name && { name: updates.name }),
      ...(updates.block !== undefined && { block: updates.block }),
      ...(updates.unit && { unit: updates.unit }),
      ...(updates.phone && { phone: updates.phone }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    throw new Error(`Falha ao atualizar morador: ${error.message}`);
  }
  return true;
}

export async function deleteUserFromSupabase(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Erro ao excluir usuário do Supabase:', error);
    throw new Error(`Falha ao excluir morador: ${error.message}`);
  }
  return true;
}

