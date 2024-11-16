import SurveyOption from "./SurveyOption";

export default class Survey {
    sondageId: number | null; // ID du sondage, peut être null si généré par le backend
    nom: string; // Nom du sondage
    description: string; // Description du sondage
    fin: string; // Date de fin au format ISO
    cloture: boolean; // Indique si le sondage est clôturé
    createBy: number | null; // ID du créateur
    options: SurveyOption[]; // Options du sondage (facultatif pour le backend)

    constructor(
        sondageId: number | null = null,
        nom: string = '',
        description: string = '',
        fin: string = new Date().toISOString(), // Par défaut : date actuelle au format ISO
        cloture: boolean = false,
        createBy: number | null = null,
        options: SurveyOption[] = [] // Facultatif, utile pour le frontend
    ) {
        this.sondageId = sondageId;
        this.nom = nom;
        this.description = description;
        this.fin = fin;
        this.cloture = cloture;
        this.createBy = createBy;
        this.options = options;
    }

    // Fonction pour convertir un objet JSON en instance de Survey
    static fromJson(json: any): Survey {
        return new Survey(
            json.sondageId || null,
            json.nom || '',
            json.description || '',
            json.fin || new Date().toISOString(),
            json.cloture || false,
            json.createBy || null,
            (json.options || []).map((option: any) => SurveyOption.fromJson(option)) // Conversion des options
        );
    }
}
