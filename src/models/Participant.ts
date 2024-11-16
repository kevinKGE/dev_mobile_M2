export default class Participant {
    id: number | null; // Identifiant du participant
    firstName: string; // Prénom
    lastName: string; // Nom

    constructor(id: number | null = null, firstName: string = '', lastName: string = '') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Fonction pour convertir un objet JSON en instance de Participant
    static fromJson(json: any): Participant {
        return new Participant(
            json.participantId || null, // Correspond au "participantId" du backend
            json.prenom || '', // Correspond au "prenom" du backend
            json.nom || '' // Correspond au "nom" du backend
        );
    }
}
