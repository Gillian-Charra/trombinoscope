async function jsonFetch(url){
    let response = await fetch(url,
        /*{headers:new Headers({"Authorization":"Bearer TOKEN_GIT"})}*/
    )
    if (response.status===204){
        return null;
    }
    if (response.ok) {
        return await response.json()
    }
    
    return response
}
async function genereHTML(nom){
    let user=await jsonFetch("https://api.github.com/users/"+nom);
    let repos=await jsonFetch(user.repos_url);
    let dropdownbtnOptions='';
    let main=document.getElementById("main");
    let i=0;
    let NBR_REPO_AFF=3;
    profile=document.createElement("div");
    profile.setAttribute('class','profile');
        profil_image=document.createElement("div");
        profil_image.setAttribute('class','profile-image');
            photo_profil_img=document.createElement("img");
            setMultipleAttributes(photo_profil_img,[['class' ,"photo-profil"], ['id',`photo-profil-${user.id}`],['src', user.avatar_url]]);
        profil_image.appendChild(photo_profil_img);
    profile.appendChild(profil_image);
        emplacement_nom=document.createElement("div");
        emplacement_nom.setAttribute('class','emplacement-nom');
            nomh1=document.createElement("h1");
            nomh1.setAttribute('class','profile-user-name');
            nomh1.innerHTML=user.login;
        emplacement_nom.appendChild(nomh1);
            dropdown=document.createElement("div");
            dropdown.setAttribute('class','dropdown btn profile-edit-btn dropdown-toggle');
                button=document.createElement("btn");
                setMultipleAttributes(button,[['class' ,"btn-dropd w-100"], ['type',`button`],['data-toggle', 'dropdown']]);
                button.innerHTML='Voir les depots';
                    caret=document.createElement("span");
                    caret.setAttribute('class','caret')
                button.appendChild(caret);
                dropdown_menu=document.createElement("ul");
                dropdown_menu.setAttribute('class','dropdown-menu')
                if (repos['length'] !== 0){

                    for (let repo of repos){
                        if(i<NBR_REPO_AFF){
                        dropdownbtnOptions=document.createElement("li");
                            linksInDropdown=document.createElement("a");
                            linksInDropdown.setAttribute('href' ,repo.html_url);
                            linksInDropdown.innerHTML=repo.name;
                        dropdownbtnOptions.appendChild(linksInDropdown);
                        dropdown_menu.appendChild(dropdownbtnOptions);
                        i+=1;
                        }
                    }
                }else{
                    dropdownbtnOptions=document.createElement("li");
                        linksInDropdown=document.createElement("a");
                        linksInDropdown.innerHTML="cet utilisateur n'as pas de depots publiques";
                    dropdownbtnOptions.appendChild(linksInDropdown);
                    dropdown_menu.appendChild(dropdownbtnOptions);
                }

            dropdown.appendChild(button);
            dropdown.appendChild(dropdown_menu);
        emplacement_nom.appendChild(dropdown);
    profile.appendChild(emplacement_nom);
        profile_stats=document.createElement("div");
        profile_stats.setAttribute('class','profile-stats');
            stats_display=document.createElement("ul");
                repos_number=document.createElement("li");
                    repos_number_span=document.createElement("span");
                    setMultipleAttributes(repos_number_span,[['class' ,"profile-stat-count"]]);
                    repos_number_span.innerHTML=user.public_repos;
                repos_number.appendChild(repos_number_span);
                repos_number.innerHTML+=' Depots';
            stats_display.appendChild(repos_number);
                followers_number=document.createElement("li");
                followers_number.setAttribute('onclick',`fetchUsers('${user.followers_url}')`)
                    followers_number_span=document.createElement("span");
                    followers_number_span.setAttribute("class","profile-stat-count")
                    followers_number_span.innerHTML=user.followers;
                followers_number.appendChild(followers_number_span);
                followers_number.innerHTML+=' Followers';
            stats_display.appendChild(followers_number);
                following_number=document.createElement("li");
                following_number.setAttribute('onclick',`fetchUsers('https://api.github.com/users/${user.login}/following')`)
                    following_number_span=document.createElement("span");
                    following_number_span.setAttribute("class","profile-stat-count")
                    following_number_span.innerHTML=user.following;
                following_number.appendChild(following_number_span);
                following_number.innerHTML+=' Following';
            stats_display.appendChild(following_number);
        profile_stats.appendChild(stats_display);
    profile.appendChild(profile_stats);
        bio=document.createElement("div");
        bio.setAttribute('class',`profile-bio`)
            bio_text=document.createElement("p");
            if (user.bio==null){user.bio="Cet utilisateur n'as pas de bio";}
            bio_text.innerHTML=user.bio;
        bio.appendChild(bio_text);
    profile.appendChild(bio);
main.appendChild(profile);
return "j'ai finis";
}
async function fetchNomEtudiants(){
    document.getElementById('reset-btn').classList.add("display-no");
    afficherIconeChargement();
    let listeEtudiants=await jsonFetch("etudiants.json");
    let etudiantsNoms=shuffle(listeEtudiants["students"]);
    for (let etudiantNom of etudiantsNoms){
        genereHTML(etudiantNom);
    }
    masquerIconeChargement()
}
async function fetchUsers(utilisateurs_urls){
    document.getElementById('reset-btn').classList.add("display-no");
    afficherIconeChargement();
    utilisateurs=await jsonFetch(utilisateurs_urls);
    for (let utilisateur of utilisateurs){
        await genereHTML(utilisateur["login"]);
    }
    masquerIconeChargement()
    document.getElementById('reset-btn').classList.remove("display-no");
}






//Fonctions pratique
function afficherIconeChargement(){
    document.getElementById("main").classList.add("display-no");
    document.getElementById("icone-chargement").classList.remove("display-no");
    document.getElementById("main").innerHTML=""
}
function masquerIconeChargement(){
    document.getElementById("icone-chargement").classList.add("display-no");
    document.getElementById("main").classList.remove("display-no");
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
function setMultipleAttributes(element,attributes){
    for (attr of attributes){
        element.setAttribute(attr[0],attr[1])
    }

}
listeEtudiants=fetchNomEtudiants();


