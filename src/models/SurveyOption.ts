export default class SurveyOption {
    id: string; // Identifiant de l'option
    label: string; // Texte associé à l'option

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    // Fonction pour convertir un objet JSON en instance de SurveyOption
    static fromJson(json: any): SurveyOption {
        return new SurveyOption(
            json.id || '',
            json.label || ''
        );
    }
}
