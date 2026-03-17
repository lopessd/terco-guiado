export interface Mystery {
  title: string;
  meditation: string;
  image: string;
  background: string;
}

export interface MysteryGroup {
  id: MysteryKey;
  name: string;
  days: string;
  theme: string;
  mysteries: Mystery[];
}

export type MysteryKey = "gozosos" | "luminosos" | "dolorosos" | "gloriosos";

export const MYSTERIES: Record<MysteryKey, MysteryGroup> = {
  gozosos: {
    id: "gozosos",
    name: "Mistérios Gozosos",
    days: "Segundas e Sábados",
    theme: "A Infância de Jesus",
    mysteries: [
      {
        title: "A Anunciação do Arcanjo São Gabriel à Nossa Senhora",
        meditation:
          "Contemplemos a Anunciação do Arcanjo São Gabriel à Nossa Senhora.",
        image: "/images/gozosos/1-misterio.webp",
        background: "/images/gozosos/1-fundo.webp",
      },
      {
        title: "A Visitação de Nossa Senhora a Santa Isabel",
        meditation:
          "Contemplemos a Visitação de Nossa Senhora à sua prima Santa Isabel.",
        image: "/images/gozosos/2-misterio.webp",
        background: "/images/gozosos/2-fundo.webp",
      },
      {
        title: "O Nascimento do Menino Jesus em Belém",
        meditation:
          "Contemplemos o Nascimento do Menino Jesus em Belém.",
        image: "/images/gozosos/3-misterio.webp",
        background: "/images/gozosos/3-fundo.webp",
      },
      {
        title: "A Apresentação do Menino Jesus no Templo",
        meditation:
          "Contemplemos a Apresentação do Menino Jesus no Templo e a Purificação de Nossa Senhora.",
        image: "/images/gozosos/4-misterio.webp",
        background: "/images/gozosos/4-fundo.webp",
      },
      {
        title: "A Perda e o Encontro do Menino Jesus no Templo",
        meditation:
          "Contemplemos a Perda e o Encontro do Menino Jesus no Templo.",
        image: "/images/gozosos/5-misterio.webp",
        background: "/images/gozosos/5-fundo.webp",
      },
    ],
  },
  luminosos: {
    id: "luminosos",
    name: "Mistérios Luminosos",
    days: "Quintas-feiras",
    theme: "A Vida Pública de Jesus",
    mysteries: [
      {
        title: "O Batismo de Jesus no Rio Jordão",
        meditation: "Contemplemos o Batismo de Jesus no rio Jordão.",
        image: "/images/themes/luminosos.jpg",
        background: "/images/themes/luminosos.jpg",
      },
      {
        title: "A Auto-revelação de Jesus nas Bodas de Caná",
        meditation: "Contemplemos a Auto-revelação de Jesus nas Bodas de Caná.",
        image: "/images/themes/luminosos.jpg",
        background: "/images/themes/luminosos.jpg",
      },
      {
        title: "O Anúncio do Reino de Deus",
        meditation: "Contemplemos o Anúncio do Reino de Deus.",
        image: "/images/themes/luminosos.jpg",
        background: "/images/themes/luminosos.jpg",
      },
      {
        title: "A Transfiguração de Jesus",
        meditation: "Contemplemos a Transfiguração de Jesus.",
        image: "/images/themes/luminosos.jpg",
        background: "/images/themes/luminosos.jpg",
      },
      {
        title: "A Instituição da Eucaristia",
        meditation: "Contemplemos a Instituição da Eucaristia.",
        image: "/images/themes/luminosos.jpg",
        background: "/images/themes/luminosos.jpg",
      },
    ],
  },
  dolorosos: {
    id: "dolorosos",
    name: "Mistérios Dolorosos",
    days: "Terças e Sextas-feiras",
    theme: "A Paixão e Morte",
    mysteries: [
      {
        title: "A Agonia de Cristo no Horto",
        meditation: "Contemplemos a Agonia de Cristo Nosso Senhor, quando suou sangue no Horto.",
        image: "/images/themes/dolorosos.jpg",
        background: "/images/themes/dolorosos.jpg",
      },
      {
        title: "A Flagelação de Jesus Cristo",
        meditation: "Contemplemos a Flagelação de Jesus Cristo atado à coluna.",
        image: "/images/themes/dolorosos.jpg",
        background: "/images/themes/dolorosos.jpg",
      },
      {
        title: "A Coroação de Espinhos",
        meditation: "Contemplemos a Coroação de espinhos de Nosso Senhor.",
        image: "/images/themes/dolorosos.jpg",
        background: "/images/themes/dolorosos.jpg",
      },
      {
        title: "Jesus Carrega a Cruz para o Calvário",
        meditation: "Contemplemos Jesus Cristo carregando a Cruz para o Calvário.",
        image: "/images/themes/dolorosos.jpg",
        background: "/images/themes/dolorosos.jpg",
      },
      {
        title: "A Crucificação e Morte de Nosso Senhor",
        meditation: "Contemplemos a Crucificação e morte de Nosso Senhor Jesus Cristo.",
        image: "/images/themes/dolorosos.jpg",
        background: "/images/themes/dolorosos.jpg",
      },
    ],
  },
  gloriosos: {
    id: "gloriosos",
    name: "Mistérios Gloriosos",
    days: "Domingos e Quartas",
    theme: "A Ressurreição e a Glória",
    mysteries: [
      {
        title: "A Ressurreição de Cristo Nosso Senhor",
        meditation: "Contemplemos a Ressurreição de Cristo Nosso Senhor.",
        image: "/images/themes/gloriosos.jpg",
        background: "/images/themes/gloriosos.jpg",
      },
      {
        title: "A Ascensão de Nosso Senhor ao Céu",
        meditation: "Contemplemos a Ascensão de Nosso Senhor ao Céu.",
        image: "/images/themes/gloriosos.jpg",
        background: "/images/themes/gloriosos.jpg",
      },
      {
        title: "A Vinda do Espírito Santo",
        meditation: "Contemplemos a Vinda do Espírito Santo sobre os Apóstolos reunidos com Maria Santíssima no Cenáculo em Jerusalém.",
        image: "/images/themes/gloriosos.jpg",
        background: "/images/themes/gloriosos.jpg",
      },
      {
        title: "A Assunção de Nossa Senhora ao Céu",
        meditation: "Contemplemos a Assunção de Nossa Senhora ao Céu.",
        image: "/images/themes/gloriosos.jpg",
        background: "/images/themes/gloriosos.jpg",
      },
      {
        title: "A Coroação de Nossa Senhora",
        meditation: "Contemplemos a Coroação de Nossa Senhora no Céu como Rainha de todos os anjos e santos.",
        image: "/images/themes/gloriosos.jpg",
        background: "/images/themes/gloriosos.jpg",
      },
    ],
  },
};
