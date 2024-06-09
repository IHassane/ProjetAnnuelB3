import React, {useState} from 'react';
import '../style/MedicalAct.css';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import {AccordionActions, Alert, Button, InputAdornment, TextField, Typography} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SaveIcon from "@mui/icons-material/Save";
import {medicalActService} from "../_services/medicalAct.service";


const MedicalAct = (props) => {
    //_____Variables_____//
    const [newMedicalActData, setNewMedicalActData] = useState({
        // Remarque : si la l'historique est vide pour le patient, props.data n'est pas alimenté par PatientHistory
        //id:, TODO a gerer cote back
        //service:, TODO a gerer avec la liste deroulante
        //nir:, TODO a gerer avec la localStorage
        date: "",
        intitule_acte: "",
        nom_medecin: "",
        description: ""
    });

    // UseState d'affichage des intitulés
    const [showLabel, setShowLabel] = useState(false);
    // Gestion du message d'erreur
    const [alertMessage, setAlertMessage] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const handleCloseAlert = () => {
        setAlertOpen(false);
    }
    // UseState de gestion du bouton sauvegarder
    const [saveEnable, setSaveEnable] = useState(false);

    //_____Evènements_____//
    // Gestion de l'affichage des intitulés
    const handleLabel = () => {
        setShowLabel(!showLabel);
    };
    // Detection d'un champ modifié sur un type create
    const handleChange = (event) => {
        setAlertOpen(false); // masquage de l'alerte erreur
        setSaveEnable(true); // permettre l'enregistrement
        setNewMedicalActData({
            ...newMedicalActData,
            [event.target.name]: event.target.value
        });
    };
    // Enregistrement du nouvel acte médical
    const handleSave = () => {
        setSaveEnable(false); // griser l'enregistrement
        if (controlChange()) { // contrôles de saisie
            setAlertOpen(false) // masquage de l'alerte erreur
            // TODO requete API
        } else {
            setAlertOpen(true);
        }
    };

    //_____Contrôles_____
    const controlChange = (event) => {
        // Contrôle existance dossier médical
        if (!medicalActService.medFileExists(props.nir)) {
            setAlertMessage("Le dossier médical n'existe pas pour ce patient, créez le ci-dessus.");
            return false;
        }
        // Controle des champs
        else if (!medicalActService.isDateValid(newMedicalActData.date)) {
            setAlertMessage("Saisie incorrecte, la date n'est pas une date valide.");
            setAlertOpen(true);
            return false;
        } else if (!medicalActService.isOldDate(newMedicalActData.date)) {
            setAlertMessage("La date de l'acte est trop ancienne, ouvrez un incident.");
            setAlertOpen(true);
            return false;
        } else if (!medicalActService.isIntituleValide(newMedicalActData.intitule_acte)) {
            setAlertMessage("Saisie incorrecte, l'intitulé de l'acte est manquant.");
            setAlertOpen(true);
            return false;
        } else if (!medicalActService.isNomValide(newMedicalActData.nom_medecin)) {
            setAlertMessage("Saisie incorrecte, le nom du médecin est manquant.");
            setAlertOpen(true);
            return false;
        } else if (!medicalActService.isDescValide(newMedicalActData.description)) {
            setAlertMessage("Saisie incorrecte, la description de l'acte est manquante.");
            setAlertOpen(true);
            return false;
        } else {
            return true;
        }
    };

    //_____Affichage_____//
    return (<div className="MedicalAct">
            {/* Composant repliable*/}
            <Accordion
                sx={{width: '100%'}}
                // Si MedicalAct>create ou MedicalAct>display label affichés alors on dépli
                expanded={props.type === "create" || showLabel}
            >
                {/* Partie visible du composant replié*/}
                <AccordionSummary
                    // Affichage des labels de l'entête si déplié
                    expandIcon={props.type === "display" && <ExpandMoreIcon onClick={handleLabel}/>}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    onClick={handleLabel}
                    sx={{'&:hover': {bgcolor: 'white'}}}
                >
                    <div className="AccordionSummaryRow">
                        {/* Affichage du titre pour un nouvel acte médical*/}
                        {props.type === "create" && <div className="NewMedicalActLabel">Nouvel acte médical</div>}
                        <div className="MedicalActInfoGlobal">
                            <div className="MedicalActLogo">
                                <DescriptionIcon sx={{color: '#204213', height: "30px", width: "auto"}}/>
                            </div>
                            <div className="MedicalActDate">
                                <div className="MedicalActInfoField">
                                    {/* Si MedicalAct>display déplié ou MedicalAct>create alors on affiche le label*/}
                                    {(showLabel || props.type === "create") && (<Typography
                                        variant="body1"
                                        sx={{mb: 1, color: '#204213'}}>
                                        Date</Typography>)}
                                    {/* Champ de type date pour create*/}
                                    {props.type === "create" && <TextField
                                        className="InfoFieldGlobal"
                                        name="date"
                                        type="date"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Date du jour"
                                        value={newMedicalActData.date}
                                        variant="standard"
                                        onChange={handleChange}
                                    />}
                                    {/* Champ de type string pour display*/}
                                    {props.type === "display" && <TextField
                                        className="InfoFieldGlobal"
                                        name="date"
                                        disabled
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Date du jour"
                                        value={props.data.date}
                                        variant="standard"
                                    />}
                                </div>
                            </div>
                            <div className="MedicalActName">
                                <div className="MedicalActInfoField">
                                    {/* Si MedicalAct>display déplié ou MedicalAct>create alors on affiche le label*/}
                                    {(showLabel || props.type === "create") && (<Typography
                                        variant="body1"
                                        sx={{mb: 1, color: '#204213'}}>
                                        Intitulé de l'acte médical</Typography>)}
                                    <TextField
                                        className="InfoFieldGlobal"
                                        name="intitule_acte"
                                        // Si MedicalAct>display on grise le champ
                                        disabled={props.type === "display"}
                                        placeholder="Intitulé de la consultation"
                                        value={props.type === "display" ? props.data.intitule_acte :
                                            newMedicalActData.intitule_acte}
                                        variant="standard"
                                        sx={{width: '100%'}}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionSummary>
                {/* Partie visible du composant déplié*/}
                <AccordionDetails>
                    <div className="MedicalActInfoBody">
                        <div className="MedicalActInfoBodyRow">
                            <div className="MedicalActDoctor">
                                <div className="MedicalActInfoField">
                                    <Typography variant="body1" sx={{mb: 1, color: '#204213'}}>Nom du
                                        médecin</Typography>
                                    <TextField
                                        className="InfoFieldColored"
                                        name="nom_medecin"
                                        // Si MedicalAct>display on grise le champ
                                        disabled={props.type === "display"}
                                        placeholder="Nom du médecin"
                                        value={props.type === "display" ? props.data.nom_medecin :
                                            newMedicalActData.nom_medecin}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <AssignmentIndIcon sx={{color: '#204213'}}/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{mb: 2}}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="MedicalActLogo">
                                {/*dev non prioritaire, a afficher sur le type display*/}
                                {props.type === "none" && <DownloadIcon sx={{color: '#204213',
                                    height: "30px", width: "auto"}}/>}
                            </div>
                        </div>
                        <div className="MedicalActInfoBodyRow">
                            <div className="MedicalActInfoField">
                                <Typography variant="body1"
                                            sx={{mb: 1, color: '#204213'}}>Compte-rendu</Typography>
                                <TextField
                                    className="InfoFieldColored"
                                    name="description"
                                    // Si MedicalAct>display on grise le champ
                                    disabled={props.type === "display"}
                                    multiline
                                    rows={10}
                                    placeholder="Rédiger un compte-rendu détaillé"
                                    value={props.type === "display" ? props.data.description :
                                        newMedicalActData.description}
                                    sx={{width: '100%'}}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
                {/* Si MedicalAct de type création, on affiche les boutons*/}
                {props.type === "create" && <AccordionActions>
                    <div className="MedicalActButtonsContainer">
                        <div className="MedicalActButtonContainer">
                            {alertOpen &&
                                <div className="newMedicalActAlert">
                                    <Alert severity="error"
                                           onClose={handleCloseAlert}
                                           sx={{Width: '100%'}}>
                                        {alertMessage}
                                    </Alert>
                                </div>
                            }
                            <div className="MedicalActSaveChange">
                                <Button variant="contained"
                                        endIcon={<SaveIcon/>}
                                        onClick={handleSave}
                                        disabled={!saveEnable}
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </div>
                    </div>
                </AccordionActions>}
            </Accordion>
        </div>
    )
}

export default MedicalAct;