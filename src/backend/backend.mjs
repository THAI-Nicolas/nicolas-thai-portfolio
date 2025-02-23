import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

export async function getProjets() {
  try {
    let data = await pb.collection("projets").getFullList({
      sort: "created",
    });
    data = data.map((projet) => {
      projet.img = pb.files.getURL(projet, projet.img);
      return projet;
    });
    return data;
  } catch (error) {
    console.log("Une erreur est survenu pour charger tous les projets", error);
    return [];
  }
}

export async function getProjet(id) {
    try {
     let data = await pb.collection("projets").getOne(id);
     data.img = pb.files.getURL(data, data.img);
     return data;
    } catch (error) {
        console.log("Une erreur est survenue pour charger le projet", error);
        return null;
    }
}
