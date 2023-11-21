export default function SearchBlockACP({ searchArgs, setSearch }){

    const addSearchArg = (event)=>{
        let input = event.target;   
        let field = input.getAttribute('field');
        
        if(input.value){
            searchArgs[field] = input.value;
        }else if(searchArgs[field]){
            delete searchArgs[field];
        }
        setSearch(prev => !prev);
    }
    
    return(
        <div className="search-block">
            <div className="filters">
                <div className="filter">
                    <label className="main-label">Patient</label>
                    <input onChange={addSearchArg} field="patient" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Produit</label>
                    <input onChange={addSearchArg} field="name" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Prtocole</label>
                    <input onChange={addSearchArg} field="protocole" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Date</label>
                    <input onChange={addSearchArg} field="startDate" type="date" className="main-input" />
                </div>
            </div>
        </div>
        )
}