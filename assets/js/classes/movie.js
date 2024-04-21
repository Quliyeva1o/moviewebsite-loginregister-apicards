export class Movie {
    constructor(title, genre, country, director, ageRestriction, poster, trailerURL, description, releaserYear) {
        this.title = title;
        this.genre = genre;
        this.country = country;
        this.director = director;
        this.ageRestriction = ageRestriction;
        this.poster = poster;
        this.description = description;
        this.releaserYear = releaserYear;
        const trailerURL = trailerURL.slice(trailerURL.indexOf("youtu.be/") + 9);
    }
}  