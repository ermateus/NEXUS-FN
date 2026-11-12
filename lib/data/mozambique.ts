export const PROVINCES = [
  "Niassa",
  "Cabo Delgado",
  "Nampula",
  "Zambézia",
  "Tete",
  "Manica",
  "Sofala",
  "Inhambane",
  "Gaza",
  "Maputo Província",
  "Maputo Cidade"
] as const;

export type Province = typeof PROVINCES[number];

export const DISTRICTS: Record<Province, string[]> = {
  "Niassa": ["Lichinga", "Cuamba", "Lago", "Majune", "Mandimba", "Marrupa", "Maúa", "Metarica", "Muembe", "N'gauma", "Nipepe", "Sanga", "Mecanhelas", "Chimbonila"],
  "Cabo Delgado": ["Pemba", "Ancuabe", "Balama", "Chiúre", "Ibo", "Macomia", "Mecúfi", "Meluco", "Metuge", "Mocímboa da Praia", "Montepuez", "Mueda", "Muidumbe", "Namuno", "Nangade", "Palma", "Quissanga"],
  "Nampula": ["Nampula", "Angoche", "Eráti", "Ilha de Moçambique", "Lalaua", "Larde", "Liúpo", "Malema", "Meconta", "Mecubúri", "Memba", "Mogincual", "Mogovolas", "Moma", "Monapo", "Mossuril", "Muecate", "Murrupula", "Nacala-a-Velha", "Nacala Porto", "Nacarôa", "Rapale", "Ribáuè"],
  "Zambézia": ["Quelimane", "Alto Molócuè", "Chinde", "Derre", "Gile", "Gurué", "Ile", "Inhassunge", "Luaruo", "Lugela", "Maganja da Costa", "Milange", "Mocuba", "Mocubela", "Molumbo", "Mopeia", "Morrumbala", "Mulevala", "Namacurra", "Namarroi", "Nicoadala", "Pebane"],
  "Tete": ["Tete", "Angónia", "Cahora-Bassa", "Changara", "Chifunde", "Chiuta", "Dôa", "Macanga", "Magoé", "Marávia", "Moatize", "Mutarara", "Tsangano", "Zumbo"],
  "Manica": ["Chimoio", "Báruè", "Gondola", "Guro", "Macate", "Machaze", "Macossa", "Manica", "Mossurize", "Sussundenga", "Tambara", "Vanduzi"],
  "Sofala": ["Beira", "Buzi", "Caia", "Chemba", "Cheringoma", "Chibabava", "Dondo", "Gorongosa", "Machanga", "Maringué", "Muanza", "Nhamatanda"],
  "Inhambane": ["Inhambane", "Maxixe", "Funhalouro", "Govuro", "Homoíne", "Inharrime", "Inhassoro", "Jangamo", "Mabote", "Massinga", "Morrumbene", "Panda", "Vilankulo", "Zavala"],
  "Gaza": ["Xai-Xai", "Bilene", "Chibuto", "Chicualacuala", "Chigubo", "Choke", "Guijá", "Limpopo", "Mabalane", "Mandlakazi", "Mapai", "Massangena", "Massingir"],
  "Maputo Província": ["Matola", "Boane", "Magude", "Manhiça", "Marracuene", "Matutuíne", "Moamba", "Namaacha"],
  "Maputo Cidade": ["Distrito Municipal de KaMpfumo", "Distrito Municipal de Nlhamankulu", "Distrito Municipal de KaMaxakeni", "Distrito Municipal de KaMavota", "Distrito Municipal de KaMubukwana", "Distrito Municipal de KaTembe", "Distrito Municipal de KaNyaka"]
};
