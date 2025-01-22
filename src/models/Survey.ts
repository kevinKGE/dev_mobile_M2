import SurveyOption from "./SurveyOption";

export default class Survey {
  sondageId: number | null; // ID du sondage
  nom: string; // Nom du sondage
  description: string; // Description
  fin: string; // Date de fin
  cloture: boolean; // Indique si le sondage est clôturé
  createBy: number | null; // ID du créateur
  options: SurveyOption[]; // Options du sondage
  photoBase64: string | null; // Photo encodée en base64 (nouvelle propriété)

  constructor(
    sondageId: number | null = null,
    nom: string = "",
    description: string = "",
    fin: string = new Date().toISOString(),
    cloture: boolean = false,
    createBy: number | null = null,
    options: SurveyOption[] = [],
    photoBase64: string | null = null
  ) {
    this.sondageId = sondageId;
    this.nom = nom;
    this.description = description;
    this.fin = fin;
    this.cloture = cloture;
    this.createBy = createBy;
    this.options = options;
    this.photoBase64 = photoBase64;
  }

  // Méthode pour convertir un objet JSON en instance de Survey
  static fromJson(json: any): Survey {
    return new Survey(
      json.sondageId || null,
      json.nom || "",
      json.description || "",
      json.fin || new Date().toISOString(),
      json.cloture || false,
      json.createBy || null,
      (json.options || []).map((option: any) => SurveyOption.fromJson(option)),
      json.photoBase64 || null // Ajout de la conversion de photoBase64
    );
  }
}
