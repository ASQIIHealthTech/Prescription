export default function SearchBlock({ searchArgs, setSearch }){

    const addSearchArg = (event)=>{
        let input = event.target;   
        let field = input.getAttribute('field');
        console.log(input.value)
        if(input.value){
            searchArgs[field] = input.value;
        }else if(searchArgs[field]){
            delete searchArgs[field];
        }
        setSearch(prev => !prev);
    }
    
    return(
        <div className="search-block">
            <h1>Recherche</h1>
            <div className="filters">
                <div className="filter">
                    <label className="main-label">DMI</label>
                    <input onChange={addSearchArg} field="DMI" type="number" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Nom</label>
                    <input onChange={addSearchArg} field="nom" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Prénom</label>
                    <input onChange={addSearchArg} field="prenom" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Date De Naissance</label>
                    <input onChange={addSearchArg} field="birthDate" type="date" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Genre</label>
                    <select onChange={addSearchArg} field="sexe" className="main-input" name="sexe" id="sexe">
                        <option value=""></option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                    </select>
                </div>
            </div>
        </div>
        )
}