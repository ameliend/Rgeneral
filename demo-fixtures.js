'use strict';
/* Jeu de volume purement fictif. Aucune recherche ni création de société réelle. */
const RG_VOLUME_ASSOCIATES = ['Amélien Delahaie','Steve Rodgers','Camille Moreau','Léa Laurent','Hugo Bernard','Inès Dubois','Louis Martin','Emma Petit','Gabriel Roux','Jade Lefèvre','Arthur Garnier','Chloé Mercier','Raphaël Fontaine','Manon Chevalier','Nathan François','Sarah Leclerc','Paul Gauthier','Zoé Morel','Lucas Perrin','Alice Renaud'];
const RG_VOLUME_COMPANIES = [
 ['Atelier Horizon','SAS','Architecture et design','12 rue des Ateliers','44000 Nantes'],
 ['Maison Sillage','SARL','Commerce de détail','8 avenue des Tilleuls','33000 Bordeaux'],
 ['Studio Équinoxe','SAS','Communication visuelle','21 rue des Arts','69002 Lyon'],
 ['Nova Conseil','SASU','Conseil en organisation','4 place des Idées','75011 Paris'],
 ['Les Jardins d’Alba','SARL','Aménagement paysager','15 allée des Jardins','35000 Rennes'],
 ['Lumen Technologies','SAS','Édition de logiciels','7 rue de l’Innovation','59000 Lille'],
 ['Rivage Patrimoine','SCI','Gestion immobilière','3 quai des Embruns','13002 Marseille'],
 ['Cobalt Services','EURL','Services aux entreprises','18 boulevard des Métiers','31000 Toulouse'],
 ['Le Comptoir des Saveurs','SARL','Restauration','6 place du Marché','67000 Strasbourg'],
 ['Orbite Créative','SAS','Production audiovisuelle','10 rue des Images','34000 Montpellier']
];
const RG_VOLUME_VERSION = 'rg-demo-volume-v1';
function seedVolumeFixtures(entries) {
  try { if (localStorage.getItem(RG_VOLUME_VERSION) === '1') return false; } catch {}
  const thirty = entries.find(entry => entry.id === 's898224209');
  if (thirty) {
    // Une seule migration ; le précédent actionnariat reste récupérable dans ce navigateur.
    try { if (!localStorage.getItem('rg-demo-before-volume-v1')) localStorage.setItem('rg-demo-before-volume-v1', JSON.stringify({ownership:thirty.ownership || initialOwnership()})); } catch {}
    const previous = thirty.ownership?.associates || [];
    thirty.ownership = normalizeOwnership({total:1000,nominalCents:100,type:'Actions ordinaires',name:'',associates:RG_VOLUME_ASSOCIATES.map((name,index) => ({...(previous.find(item => item.id === String(index+1) && item.name === name) || {}),id:String(index+1),account:index+1,name,kind:'Personne physique',shares:50,email:'',address:''}))},true);
    thirty.volumeDemo = true;
  }
  RG_VOLUME_COMPANIES.forEach(([name,form,activity,street,city],index) => {
    const siren = '000000' + String(101+index), id = 's' + siren;
    if (entries.some(entry => entry.id === id)) return;
    entries.push({id,data:companyData({name,form,siren,siret:siren+'00010',created:'15/01/2024',closing:'31 décembre',activity,street,city}),example:false,demoFixture:true,settings:{reminders:true,digest:false},ownership:emptyOwnership(),registers:createRegisters(false)});
  });
  return true;
}
