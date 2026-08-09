export interface CategoryGroup {
  name: string;
  iconName: string;
  subcategories: string[];
}

export const CLASSIFIED_CATEGORIES_DATA: CategoryGroup[] = [
  {
    name: "Casa, Decoração e Utensílios",
    iconName: "Lamp",
    subcategories: [
      "Tecidos de Cama, Mesa e Banho",
      "Decorações Para Casa",
      "Casa Inteligente",
      "Utensílios Para Cozinha",
      "Utensílios Para Banheiro e Limpeza",
      "Iluminação",
      "Segurança Residencial",
      "Jardinagem e Plantas",
      "Área Externa",
    ],
  },
  {
    name: "Móveis",
    iconName: "Armchair",
    subcategories: [
      "Camas e Colchões",
      "Sofás e Poltronas",
      "Bancos e Cadeiras",
      "Mesas",
      "Escrivaninhas e Penteadeiras",
      "Racks e Painéis",
      "Armários e Guarda-Roupas",
      "Móveis Para Organização",
    ],
  },
  {
    name: "Eletro",
    iconName: "WashingMachine",
    subcategories: [
      "Ar-condicionados",
      "Ventiladores e Climatizadores",
      "Geladeiras e Freezers",
      "Fogões e Fornos",
      "Máquinas de Lavar e Secadoras",
      "Eletroportáteis Para Cozinha e Limpeza",
      "Eletroportáteis Para Cuidados Pessoais",
    ],
  },
  {
    name: "Festas e Casamentos",
    iconName: "PartyPopper",
    subcategories: [
      "Convites e Papelaria",
      "Decoração e Cenografia",
      "Balões e Infláveis",
      "Topos de Bolo e Velas",
      "Lembrancinhas e Brindes",
      "Acessórios para Noivas e Noivos",
      "Outros Itens de Festa",
    ],
  },
  {
    name: "Celulares e Telefonia",
    iconName: "Smartphone",
    subcategories: [
      "Celulares e Smartphones",
      "Acessórios de Celular",
      "Peças de Celular",
      "Smartwatches",
      "Acessórios Para Smartwatch",
      "Telefonia Fixa e Sem Fio",
    ],
  },
  {
    name: "Informática",
    iconName: "Laptop",
    subcategories: [
      "Computadores e Desktops",
      "Notebooks",
      "Monitores",
      "Periféricos e Acessórios de Computador",
      "Peças de Hardware",
      "Armazenamento",
      "Memória RAM",
      "Processadores",
      "Placas de Vídeo",
      "Conectividade e Dispositivos de Rede",
      "Tablets e E-Readers",
    ],
  },
  {
    name: "Games",
    iconName: "Gamepad2",
    subcategories: [
      "Consoles de Vídeo Game",
      "Jogos de Vídeo Game",
      "Peças e Acessórios de Vídeo Game",
    ],
  },
  {
    name: "TVs e vídeo",
    iconName: "Tv",
    subcategories: [
      "Televisores e Smart TVs",
      "Projetores e Acessórios de Vídeo",
      "Equipamentos de TV por Assinatura / Streaming",
    ],
  },
  {
    name: "Áudio",
    iconName: "Headphones",
    subcategories: [
      "Fones de Ouvido",
      "Aparelhos de Som",
      "Microfones e Gravadores",
      "Equipamentos e Acessórios de Som",
    ],
  },
  {
    name: "Câmeras e Drones",
    iconName: "Camera",
    subcategories: [
      "Câmeras e Filmadoras",
      "Acessórios para Câmeras e Filmadoras",
      "Drones",
    ],
  },
  {
    name: "Moda e beleza",
    iconName: "Shirt",
    subcategories: [
      "Beleza e Cuidados Pessoais",
      "Roupas",
      "Bolsas, malas e mochilas",
      "Acessórios",
      "Calçados",
    ],
  },
  {
    name: "Comércio",
    iconName: "Store",
    subcategories: [
      "Equipamentos Para Comércio",
      "Gastronomia e Hotelaria",
      "Equipamentos Médicos e Hospitalares",
      "Uniformes de Trabalho e EPIs",
      "Trailers e carrinhos comerciais",
    ],
  },
  {
    name: "Escritório e Home Office",
    iconName: "Briefcase",
    subcategories: [
      "Itens Para Escritório",
      "Cadeiras de Escritório e Gamer",
      "Móveis de Escritório",
      "Papelaria",
    ],
  },
  {
    name: "Música e hobbies",
    iconName: "Guitar",
    subcategories: [
      "Instrumentos musicais",
      "CDs, DVDs etc",
      "Livros e revistas",
      "Antiguidades",
      "Hobbies e coleções",
    ],
  },
  {
    name: "Esportes e Fitness",
    iconName: "Dumbbell",
    subcategories: [
      "Bicicletas e Acessórios",
      "Equipamentos Fitness e Musculação",
      "Artigos Esportivos",
    ],
  },
  {
    name: "Materiais de Construção",
    iconName: "Hammer",
    subcategories: [
      "Fundação e Estrutura",
      "Alvenaria",
      "Pisos e Revestimentos",
      "Portas e Janelas",
      "Cubas e Pias",
      "Torneiras, Duchas e Vasos",
      "Instalações Elétricas e Hidráulicas",
      "Ferramentas de Construção",
      "Ferramentas de Pintura",
    ],
  },
  {
    name: "Artigos infantis",
    iconName: "Baby",
    subcategories: [
      "Roupas Infantis",
      "Calçados Infantis",
      "Roupas para Bebês",
      "Calçados Para Bebês",
      "Brinquedos e Jogos",
      "Maternidade e Cuidados com o Bebê",
      "Móveis Infantis",
    ],
  },
  {
    name: "Animais de estimação",
    iconName: "Dog",
    subcategories: [
      "Acessórios para pets",
      "Cachorros",
      "Gatos",
      "Roedores",
      "Outros animais",
    ],
  },
  {
    name: "Agro e indústria",
    iconName: "Tractor",
    subcategories: [
      "Máquinas e Ferramentas Agrícolas / Industriais",
      "Outros Itens Agro e Indústria",
    ],
  },
  {
    name: "Outros",
    iconName: "Package",
    subcategories: ["Outros Produtos e Serviços"],
  },
];

export const MAIN_CATEGORIES = CLASSIFIED_CATEGORIES_DATA.map((cat) => cat.name);

export const CATEGORIES = MAIN_CATEGORIES;

export const FILTER_CATEGORIES = ["Todos", ...MAIN_CATEGORIES];

/**
 * Verifica se a categoria do item pertence à categoria selecionada (ou se é subcategoria dela)
 */
export function matchesCategoryFilter(selectedFilter: string, itemCategory: string): boolean {
  if (!selectedFilter || selectedFilter === "Todos") return true;
  if (!itemCategory) return false;

  // Correspondência exata
  if (itemCategory.toLowerCase() === selectedFilter.toLowerCase()) return true;

  // Verificar se o itemCategory é uma subcategoria da categoria principal selecionada
  const mainGroup = CLASSIFIED_CATEGORIES_DATA.find(
    (g) => g.name.toLowerCase() === selectedFilter.toLowerCase()
  );

  if (mainGroup) {
    const isSub = mainGroup.subcategories.some(
      (sub) => sub.toLowerCase() === itemCategory.toLowerCase()
    );
    if (isSub) return true;
  }

  // Verificar caso reverso (se selectedFilter for uma subcategoria e itemCategory for o grupo principal)
  const isSubReverse = CLASSIFIED_CATEGORIES_DATA.some(
    (g) =>
      g.name.toLowerCase() === itemCategory.toLowerCase() &&
      g.subcategories.some((sub) => sub.toLowerCase() === selectedFilter.toLowerCase())
  );
  if (isSubReverse) return true;

  return false;
}
