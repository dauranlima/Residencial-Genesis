export interface CategoryGroup {
  name: string;
  iconName: string;
  subcategories: string[];
}

export const CLASSIFIED_CATEGORIES_DATA: CategoryGroup[] = [
  { name: "💡 Casa, Decoração e Utensílios", iconName: "Lamp", subcategories: [] },
  { name: "🪑 Móveis", iconName: "Armchair", subcategories: [] },
  { name: "🔌 Eletro", iconName: "WashingMachine", subcategories: [] },
  { name: "🎉 Festas e Casamentos", iconName: "PartyPopper", subcategories: [] },
  { name: "📱 Celulares e Telefonia", iconName: "Smartphone", subcategories: [] },
  { name: "💻 Informática", iconName: "Laptop", subcategories: [] },
  { name: "🎮 Games", iconName: "Gamepad2", subcategories: [] },
  { name: "📺 TVs e vídeo", iconName: "Tv", subcategories: [] },
  { name: "🎧 Áudio", iconName: "Headphones", subcategories: [] },
  { name: "📷 Câmeras e Drones", iconName: "Camera", subcategories: [] },
  { name: "👕 Moda e beleza", iconName: "Shirt", subcategories: [] },
  { name: "🏪 Comércio", iconName: "Store", subcategories: [] },
  { name: "💼 Escritório e Home Office", iconName: "Briefcase", subcategories: [] },
  { name: "🎸 Música e hobbies", iconName: "Guitar", subcategories: [] },
  { name: "🏋️ Esportes e Fitness", iconName: "Dumbbell", subcategories: [] },
  { name: "🔨 Materiais de Construção", iconName: "Hammer", subcategories: [] },
  { name: "👶 Artigos infantis", iconName: "Baby", subcategories: [] },
  { name: "🐶 Animais de estimação", iconName: "Dog", subcategories: [] },
  { name: "🚜 Agro e indústria", iconName: "Tractor", subcategories: [] },
  { name: "📦 Outros", iconName: "Package", subcategories: [] },
];

export const MAIN_CATEGORIES = CLASSIFIED_CATEGORIES_DATA.map((cat) => cat.name);

export const CATEGORIES = MAIN_CATEGORIES;

export const FILTER_CATEGORIES = ["Todos", ...MAIN_CATEGORIES];

/**
 * Remove emojis e pontuação simples para comparar nomes de categorias com resiliência
 */
function normalizeCategoryName(str: string): string {
  return str
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "")
    .trim()
    .toLowerCase();
}

/**
 * Verifica se a categoria do item pertence à categoria selecionada
 */
export function matchesCategoryFilter(selectedFilter: string, itemCategory: string): boolean {
  if (!selectedFilter || selectedFilter === "Todos") return true;
  if (!itemCategory) return false;

  // Correspondência exata
  if (itemCategory.toLowerCase() === selectedFilter.toLowerCase()) return true;

  // Correspondência ignorando emojis (para compatibilidade com itens salvos antes ou depois da adição de emojis)
  const normSelected = normalizeCategoryName(selectedFilter);
  const normItem = normalizeCategoryName(itemCategory);

  if (normSelected && normItem) {
    if (normSelected === normItem) return true;
    if (normItem.includes(normSelected) || normSelected.includes(normItem)) return true;
  }

  return false;
}

export interface ServiceCategoryItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  { id: "beleza", name: "Beleza e Bem-Estar", emoji: "💄", description: "Maquiagem, cabelo, estética e cuidados pessoais" },
  { id: "domesticos", name: "Serviços Domésticos", emoji: "🧹", description: "Limpeza residencial, faxina e organização" },
  { id: "manutencao", name: "Manutenção e Reformas", emoji: "🛠️", description: "Eletricista, encanador, pintura e reparos" },
  { id: "tecnologia", name: "Tecnologia e Assistência", emoji: "💻", description: "Formatação, redes, celulares e suporte técnico" },
  { id: "pet", name: "Mundo Pet", emoji: "🐾", description: "Pet sitter, passeios, banho e tosas" },
  { id: "educacao", name: "Aulas e Educação", emoji: "📚", description: "Reforço escolar, idiomas e cursos" },
  { id: "eventos", name: "Eventos e Fotografia", emoji: "📸", description: "Fotografia, filmagem, recepção e eventos" },
  { id: "jardinagem", name: "Jardinagem e Áreas Externas", emoji: "🌱", description: "Manutenção de jardim, plantas e paisagismo" },
  { id: "fretes", name: "Fretes e Transporte", emoji: "📦", description: "Mudanças, entregas e transporte de volumes" },
  { id: "outros", name: "Outros Serviços", emoji: "💼", description: "Serviços diversos para o condomínio" },
];

export const SERVICE_FILTER_CATEGORIES = ["Todos", ...SERVICE_CATEGORIES.map((c) => `${c.emoji} ${c.name}`)];

