import { supabase } from './supabase';
import { ClassifiedItem, Coupon, ClassifiedStatus, CurrentUser, DatabaseCouponRedemption } from '@/components/condo-market/types';
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
  try {
    const { error } = await supabase
      .from('classifieds')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting classified from Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Falha ao excluir anúncio no Supabase:', e);
    return false;
  }
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
  // 1. Salva no LocalStorage fallback imediatamente
  let localMerchants: Merchant[] = [];
  try {
    const raw = localStorage.getItem(MERCHANTS_STORAGE_KEY);
    if (raw) localMerchants = JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler merchants do localStorage:', e);
  }

  const newId = `m-${Date.now()}`;
  const newMerchant: Merchant = {
    id: newId,
    ...merchant,
  };

  localMerchants.unshift(newMerchant);
  try {
    localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(localMerchants));
  } catch (e) {
    console.error('Erro ao salvar merchant no localStorage:', e);
  }

  // 2. Insere na tabela 'merchants' no Supabase
  try {
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

    if (!error && data) {
      return {
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
    } else {
      console.warn('Aviso ao salvar comerciante no Supabase (usando fallback local):', error);
    }
  } catch (e) {
    console.error('Erro ao conectar com Supabase ao criar merchant:', e);
  }

  return newMerchant;
}

export async function getMerchantByAccessCode(code: string): Promise<Merchant | null> {
  if (!code) return null;
  const cleanCode = code.trim();

  // 1. Tentar buscar do localStorage
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

  // 2. Consultar no Supabase
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
      };
    }
  } catch (e) {
    console.error('Erro ao buscar comerciante por código no Supabase:', e);
  }

  return null;
}

export async function fetchMerchantsFromSupabase(): Promise<Merchant[]> {
  const resultMerchants: Merchant[] = [];
  const addedIds = new Set<string>();

  // 0. Carregar do localStorage
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

  try {
    // 1. Tentar buscar da tabela 'merchants' se existir no Supabase (sem retornar access_code sensivel)
    const { data: merchantsData, error: merchantsErr } = await supabase
      .from('merchants')
      .select('id, business_name, category, responsible_name, description, address, phone, logo_url');

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
          });
        }
      });
    }

    // 2. Extrair parceiros reais a partir dos anúncios na tabela 'promotions'
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

  return resultMerchants;
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
// PERSISTÊNCIA DE MORADORES POR WHATSAPP
// ==========================================

const RESIDENTS_STORAGE_KEY = 'condo_market_residents_db';

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

  let formatted = phoneWithout55;
  if (phoneWithout55.length === 11) {
    formatted = `(${phoneWithout55.slice(0, 2)}) ${phoneWithout55.slice(2, 7)}-${phoneWithout55.slice(7)}`;
  } else if (phoneWithout55.length === 10) {
    formatted = `(${phoneWithout55.slice(0, 2)}) ${phoneWithout55.slice(2, 6)}-${phoneWithout55.slice(6)}`;
  }

  const list = [
    phone.trim(),
    cleanDigits,
    phoneWithout55,
    phoneWith55,
    phoneWithPlus55,
    formatted,
    `+55 ${formatted}`,
  ];

  return {
    phoneWithout55,
    cleanDigits,
    variations: Array.from(new Set(list)).filter(Boolean),
  };
}

export async function getResidentByPhone(phone: string): Promise<CurrentUser | null> {
  if (!phone) return null;
  const { phoneWithout55, cleanDigits, variations } = getPhoneSearchVariations(phone);
  if (!phoneWithout55) return null;

  // Helper para verificar se um telefone no DB corresponde ao informado
  const isMatch = (dbPhone?: string | null): boolean => {
    if (!dbPhone) return false;
    const dbClean = dbPhone.replace(/\D/g, '');
    return dbClean.endsWith(phoneWithout55) || phoneWithout55.endsWith(dbClean);
  };

  // Helper para atualizar o cache local
  const cacheLocally = (user: CurrentUser) => {
    try {
      const raw = localStorage.getItem(RESIDENTS_STORAGE_KEY);
      const db: Record<string, CurrentUser> = raw ? JSON.parse(raw) : {};
      db[cleanDigits] = user;
      db[phoneWithout55] = user;
      db[`55${phoneWithout55}`] = user;
      localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(db));
    } catch (_e) {}
  };

  // 1. Tenta buscar no localStorage do dispositivo atual primeiro
  try {
    const raw = localStorage.getItem(RESIDENTS_STORAGE_KEY);
    if (raw) {
      const db: Record<string, CurrentUser> = JSON.parse(raw);
      if (db[cleanDigits] || db[phoneWithout55] || db[`55${phoneWithout55}`]) {
        const found = db[cleanDigits] || db[phoneWithout55] || db[`55${phoneWithout55}`];
        console.log('[ResidentDB] Encontrado no localStorage:', found.name);
        return found;
      }
    }
  } catch (e) {
    console.error('Erro ao ler base de moradores local:', e);
  }

  // 2. Tenta buscar na tabela 'users' do Supabase
  try {
    // 2a. Busca por igualdade exata de variações
    const orCondition = variations.map((v) => `phone.eq.${v}`).join(',');
    let { data: usersData } = await supabase
      .from('users')
      .select('name, block, unit, phone')
      .or(orCondition);

    // 2b. Fallback com ilike se a busca exata não retornar nada
    if (!usersData || usersData.length === 0) {
      const { data: ilikeUsers } = await supabase
        .from('users')
        .select('name, block, unit, phone')
        .ilike('phone', `%${phoneWithout55}%`)
        .limit(5);
      usersData = ilikeUsers;
    }

    if (usersData && usersData.length > 0) {
      const match = usersData.find((u) => isMatch(u.phone)) || usersData[0];
      const user: CurrentUser = {
        name: match.name || 'Morador',
        block: match.block || '',
        unit: match.unit || 'Sem Apto',
        phone: match.phone || phone,
      };
      console.log('[ResidentDB] Encontrado na tabela users:', user.name);
      cacheLocally(user);
      return user;
    }
  } catch (e) {
    console.warn('Consulta na tabela users no Supabase ignorada:', e);
  }

  // 3. Tenta buscar na tabela 'classifieds' do Supabase
  try {
    const orClassifieds = variations.map((v) => `whatsapp.eq.${v}`).join(',');
    let { data: exactClassifieds } = await supabase
      .from('classifieds')
      .select('seller_name, seller_block, seller_unit, whatsapp')
      .or(orClassifieds)
      .limit(5);

    if (!exactClassifieds || exactClassifieds.length === 0) {
      const { data: ilikeClassifieds } = await supabase
        .from('classifieds')
        .select('seller_name, seller_block, seller_unit, whatsapp')
        .ilike('whatsapp', `%${phoneWithout55}%`)
        .limit(5);
      exactClassifieds = ilikeClassifieds;
    }

    if (exactClassifieds && exactClassifieds.length > 0) {
      const c = exactClassifieds.find((item) => isMatch(item.whatsapp)) || exactClassifieds[0];
      const user: CurrentUser = {
        name: c.seller_name || 'Morador',
        block: c.seller_block || '',
        unit: c.seller_unit || 'Sem Apto',
        phone: c.whatsapp || phone,
      };
      console.log('[ResidentDB] Encontrado na tabela classifieds:', user.name);
      cacheLocally(user);
      return user;
    }
  } catch (e) {
    console.error('Erro ao buscar morador nos anúncios do Supabase:', e);
  }

  // 4. Tenta buscar na tabela 'profiles' do Supabase
  try {
    const orProfiles = variations.map((v) => `phone.eq.${v}`).join(',');
    let { data: profiles } = await supabase
      .from('profiles')
      .select('full_name, block, unit, phone')
      .or(orProfiles)
      .limit(5);

    if (!profiles || profiles.length === 0) {
      const { data: ilikeProfiles } = await supabase
        .from('profiles')
        .select('full_name, block, unit, phone')
        .ilike('phone', `%${phoneWithout55}%`)
        .limit(5);
      profiles = ilikeProfiles;
    }

    if (profiles && profiles.length > 0) {
      const match = profiles.find((p) => isMatch(p.phone)) || profiles[0];
      const user: CurrentUser = {
        name: match.full_name || 'Morador',
        block: match.block || '',
        unit: match.unit || 'Sem Apto',
        phone: match.phone || phone,
      };
      console.log('[ResidentDB] Encontrado na tabela profiles:', user.name);
      cacheLocally(user);
      return user;
    }
  } catch (e) {
    console.log('Consulta na tabela profiles no Supabase ignorada:', e);
  }

  return null;
}

export async function saveResidentProfile(resident: CurrentUser): Promise<void> {
  if (!resident.phone) return;
  const { phoneWithout55, cleanDigits } = getPhoneSearchVariations(resident.phone);
  if (!phoneWithout55) return;

  const phoneWith55 = `55${phoneWithout55}`;

  // 1. Salvar no localStorage local sob todas as chaves
  try {
    const raw = localStorage.getItem(RESIDENTS_STORAGE_KEY);
    const db: Record<string, CurrentUser> = raw ? JSON.parse(raw) : {};
    db[cleanDigits] = resident;
    db[phoneWithout55] = resident;
    db[phoneWith55] = resident;
    localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Erro ao salvar morador no localStorage:', e);
  }

  // 2. Salvar na tabela 'users' no Supabase
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

  // 3. Salvar na tabela 'profiles' caso configurada
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
