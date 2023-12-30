import { useState } from "react";
import Radio from "@mui/material/Radio";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import moment from 'moment'

export default function AdminDetails({ setAddingPatient, handleNext }) {
  const navigate = useNavigate();
  let [age, setAge] = useState(0);

  const [selectedValue, setSelectedValue] = useState("Mlle");
  const [surfCorp, setSurfCorp] = useState(0);
  const [clairance, setClairance] = useState(0);
  let [formData, setFormData] = useState({
    DMI: 0,
    index: 0,
    nom: "",
    prenom: "",
    sexe: "",
    matrimonial: "",
    birthDate: "",
    poids: 0,
    taille: 0,
    surfCorp: 0,
    formuleClair: "",
    creatinine: 0,
    clairance: 0,
    commentaire: "",
  });

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const cancel = () => {
    setAddingPatient(false);
  };

  const getAge = (birthdate) => {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);

    const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();

    // Adjust age if the birthdate hasn't occurred yet this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      return yearsDiff - 1;
    }

    return yearsDiff;
  };

  const getClairance = (formule) => {
		let clcr = 0;
    let sexe = formData.sexe;
    let creatinine = parseInt(formData.creatinine);
    let age = getAge(formData.birthDate);
    let poids = formData.poids;

    if (!(sexe && creatinine && age && poids)) {
      return;
    }

    if (formule == "mdrd") {
      if (sexe == "Homme") {
        clcr = (
          186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203)
        ).toFixed(2);
      } else if(sexe == "Femme") {
        clcr = (
          186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203) * 0.742
        ).toFixed(2);
      }
    } else if (formule == "cockroft") {
      if (sexe == "Homme") {
        clcr = ((1.23 * poids * (140 - age)) / creatinine).toFixed(2);
      } else if(sexe == "Femme") {
        clcr = ((1.04 * poids * (140 - age)) / creatinine).toFixed(2);
      }
    }else{
      clcr = 0;
    }

    return clcr;
  };

  let getSurfCorp = (poids, taille) => {
    return Math.sqrt((taille * poids) / 3600).toFixed(2);
  };

  const changeField = (event) => {
    let input = event.target;
    let field = input.getAttribute("field");
    formData[field] = input.value;

    if (field == "poids" || field == "taille") {
      let surf = getSurfCorp(formData.poids, formData.taille);
      formData["surfCorp"] = (surf>2 ? 2 : surf);
      setSurfCorp(surf);
    } else if (field == "surfCorp") {
      setSurfCorp(input.value);
    }
    if (['formuleClair', 'creatinine', 'birthDate', 'poids', 'sexe'].includes(field)) {
      let clcr = getClairance(formData['formuleClair']);
      setClairance(clcr);
      formData['clairance'] = clcr;
    }
    if(field == 'birthDate'){
      var age = moment().diff(formData[field], 'years',false);
      setAge(age)
    }
  };

  const add = () => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "/addPatient", formData)
      .then((res) => {
        setAddingPatient(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="admin-details">
      <div className="details-column">
        <h2>Données du Patient</h2>
        <div className="field">
          <label className="main-label">DMI</label>
          <input
            onChange={changeField}
            field="DMI"
            type="number"
            className="main-input"
          />
        </div>
        <div className="field">
          <label className="main-label">Index</label>
          <input
            onChange={changeField}
            field="index"
            type="number"
            className="main-input"
          />
        </div>
        <div className="field">
          <label className="main-label">Nom</label>
          <input
            type="text"
            onChange={changeField}
            field="nom"
            className="main-input"
          />
        </div>
        <div className="field">
          <label className="main-label">Prénom</label>
          <input
            type="text"
            onChange={changeField}
            field="prenom"
            className="main-input"
          />
        </div>
        <div className="field">
          <label className="main-label">Genre</label>
          <select onChange={changeField} field="sexe" className="main-input">
            <option value=""></option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>
        <div className="field">
          <label className="main-label">État civil</label>
          <select onChange={changeField} field="matrimonial" className="main-input">
            <option value=""></option>
            <option value="mariée">marié(e)</option>
            <option value="célibataire">célibataire</option>
          </select>
        </div>
        <div className="field">
          <label className="main-label">Date Naissance</label>
          <input
            type="date"
            onChange={changeField}
            field="birthDate"
            className="main-input"
          />
          <label className="age-label">{(age > 0 ? age + ' ans' : '')}</label>
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className="details-clinique-column">
        <h2>Informations Cliniques</h2>
        <div className="field">
          <label className="main-label">Poids (kg)</label>
          <input
            type="number"
            onChange={changeField}
            field="poids"
            className="main-input"
          />
        </div>
        <div className="field">
          <label className="main-label">Taille (cm)</label>
          <input
            type="number"
            onChange={changeField}
            field="taille"
            className="main-input"
          />
        </div>
        <div className="field">
          <label className="main-label">Surface corporelle (m²)</label>
          <input
            type="number"
            onChange={changeField}
            value={surfCorp > 2 ? 2 : surfCorp}
            field="surfCorp"
            className="main-input"
          />
          <label className="surfCorp-label">{surfCorp > 2 && parseFloat(surfCorp).toFixed(2)}</label>
        </div>
        <div className="field">
          <label className="main-label">Créatinine (µmol/l)</label>
          <input
            onChange={changeField}
            field="creatinine"
            type="number"
            className="main-input"
          />
        </div>
        <div className="field">
          <label className="main-label">Formule Clairance</label>
          <select
            onChange={changeField}
            field="formuleClair"
            className="main-input"
          >
            <option value=""></option>
            <option value="mdrd">mdrd</option>
            <option value="cockroft">Cockroft</option>
          </select>
        </div>
        <div className="field">
          <label className="main-label">Clairance (ml/min)</label>
          <input
            type="number"
            readOnly
            value={clairance}
            field="clairance"
            className="main-input"
          />
        </div>
      </div>
      <h2>Commentaire</h2>
      <textarea
        type="text"
        onChange={changeField}
        field="commentaire"
        className="main-input input-commentaire"
      />
      <div className="btn-container">
        <button className="main-btn" onClick={() => cancel()}>
          Annuler
        </button>
        <button className="main-btn" onClick={() => add()}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}
