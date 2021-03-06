import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import "./Map.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import btnPicture from "../../assets/Boutons/buttontransparent.png";
import axios from "axios";
import Geolocalisation from "../Hook/Geolocalisation";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import clubMarker from "../../assets/Marqueurs/LogoClub.png";
import indreMarker from "../../assets/Marqueurs/MarqueurIndre.png";
import indreEtLoireMarker from "../../assets/Marqueurs/IndreEtLoire.png";
import loirEtcher from "../../assets/Marqueurs/LoireCher2.png";
import cherMarker from "../../assets/Marqueurs/MarqueurCher.png";
import loiretMarker from "../../assets/Marqueurs/Marqueurloiret.png";
import eureEtLoireMarker from "../../assets/Marqueurs/MarqueurEureEtLoire.png";
import ligueMarker from "../../assets/Marqueurs/MarqueurLigue.png";
import "../Mobile/Responsive.css";
import fb from "../../assets/footer/fb.png";
import yt from "../../assets/footer/youtube.png";
import web from "../../assets/footer/web.png";
import defaultMaker from "../../assets/Marqueurs/defaultMarker.png";
import label from "../../assets/Marqueurs/label.png";
import markerCM2 from "../../assets/Marqueurs/CM2.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

function Mobile3() {
  const [allcities, setallcities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allteams, setallTeams] = useState([]);
  const [clubSearch, setclubSearch] = useState([]);
  const [map, setMap] = useState(null);
  const [formData, setformData] = useState({
    age: null,
    city: "",
    type: "",
    gender2: "",
    category: "",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    fontFamily: "Century",
    bgcolor: "background.paper",
    border: "2px solid #3586c2 ",
    boxShadow: 24,
    borderRadius: 12,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [clubs, setClubs]=useState([])





  const LigueMarqueur = L.icon({
    iconSize: [40, 50],
    iconAnchor: [13.5, 47],
    iconUrl: ligueMarker,
  });
  const eureEtLoirMarqueur = L.icon({
    iconSize: [50, 50],
    iconAnchor: [13.5, 47],
    iconUrl: eureEtLoireMarker,
  });

  const loiretMarqueur = L.icon({
    iconSize: [70, 50],
    iconAnchor: [13.5, 40],
    iconUrl: loiretMarker,
  });

  const cherMarqueur = L.icon({
    iconSize: [60, 50],
    iconAnchor: [13.5, 47],
    iconUrl: cherMarker,
  });

  const loireEtcherMarqueur = L.icon({
    iconSize: [40, 50],
    iconAnchor: [13.5, 47],
    iconUrl: loirEtcher,
  });
  const indreMarqueur = L.icon({
    iconSize: [40, 50],
    iconAnchor: [13.5, 47],
    iconUrl: indreMarker,
  });

  const indreEtLoirMarqueur = L.icon({
    iconSize: [55, 50],
    iconAnchor: [13.5, 47],
    iconUrl: indreEtLoireMarker,
  });

  const clubMarqueur = L.icon({
    iconSize: [50, 50],
    iconAnchor: [13.5, 47],
    iconUrl: clubMarker,
  });

  const marqueurBanque = L.icon({
    iconSize: [45, 58],
    iconAnchor: [13.5, 47],
    iconUrl: markerCM2,
  });
  console.log(formData);

  const filterSearch = (e) => {
    e.preventDefault();

    if (formData.age && formData.gender2 && formData.type && formData.city) {
      let categorieWanted = categories.filter(
        (categorySelected) =>
          formData.gender2 === categorySelected.gender &&
          formData.age >= categorySelected.minAge &&
          formData.age <= categorySelected.maxAge &&
          formData.type === categorySelected.type
      );

      const resultofSearch = allteams.filter(
        (clubWanted) =>
          clubWanted.Categorie === categorieWanted[0].name &&
          clubWanted.Localite === formData.city
      );

      setclubSearch(resultofSearch);

      var result = resultofSearch.reduceRight((unique, o) => {
        if (!unique.some((obj) => obj.AdressePostale === o.AdressePostale)) {
          unique.push(o);
        }
        return unique;
      }, []);
      console.log(result);
      setclubSearch(result);

      if (resultofSearch.length === 0) {
        console.log("There are no available locations");
        console.log(clubSearch);
      } else {
        const arrayOfLatLngs = resultofSearch.map(({ Latitude, Longitude }) => [
          Latitude,
          Longitude,
        ]);
        const bounds = L.latLngBounds(arrayOfLatLngs);
        if (map) map.flyToBounds(bounds);
      }
    }
  };

  function scrollTop() {
    window.location.href = "#top";
  }

  function scrollCard() {
    window.location.href = "#cardresult";
  }

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios.get("https://api-clubs-cvl.herokuapp.com/cities").then((res) => {
      let result = [];
      res.data.forEach((element) => {
        result.push({ label: element.name });
      });
      setallcities(result);
    });
  }, []);

  useEffect(() => {
    axios
      .get("https://api-clubs-cvl.herokuapp.com/categories")
      .then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    axios
      .get("https://api-clubs-cvl.herokuapp.com/allteams")
      .then((res) => setallTeams(res.data));
  }, []);

  useEffect(() => {
    axios
    .get("https://api-clubs-cvl.herokuapp.com/data")
    .then((res) => setClubs(res.data));
  }, [])
  console.log(clubs)

  return (
    <div className="fullPage" id="top">
      <Header id="header" />

      <div className="mobiletitleContainer">
        <h1 className="titlePart1">Trouvez un club pr??s</h1>
        <h1 className="titlePart2">
          de chez <strong className="strong"> vous !</strong>{" "}
        </h1>
      </div>

      <div className="titleContainerDesktop">
        <h1 className="titlePart1">
          Trouvez un club pr??s de chez{" "}
          <strong className="strong"> vous !</strong>{" "}
        </h1>
        <section className="legendMap">
          <p className="legend">
            Entrez votre date de naissance et la comp??tition souhait??e pour
            d??couvrir les clubs ?? proximit?? !{" "}
          </p>
        </section>
      </div>

      <div className="subContainer">
        <main className="mapContainer">
          <div
            className={
              clubSearch.length === 0 ? "mapNoSearch" : "maplegendWrapper"
            }
          >
            <h2 className="titleMapContainer">CARTE </h2>

            <MapContainer
              className="mapLeaflet"
              id="map"
              center={[48.856614, 2.3522219]}
              zoom={13}
              scrollWheelZoom={true}
              minZoo={6}
              doubleClickZoom={true}
              zoomControl={true}
              whenCreated={setMap}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Geolocalisation />

              <MarkerClusterGroup
                animate={true}
                onClusterClick={(cluster) =>
                  console.warn(
                    "cluster-click",
                    cluster,
                    cluster.layer.getAllChildMarkers()
                  )
                }
              >
                {clubSearch.length !== 0
                  ? clubSearch.slice(0, 100).map((res, index2) => {
                      return (
                        <Marker
                          icon={clubMarqueur}
                          key={index2}
                          position={[res.Latitude, res.Longitude]}
                        >
                          <Popup key={index2} className="markersPopUp">
                            <p onClick={scrollCard}> {res.NomClub}</p>
                          </Popup>
                        </Marker>
                      );
                    })
                  : null}
              </MarkerClusterGroup>
              <Marker position={[47.830261, 1.93609]} icon={LigueMarqueur}>
                <Popup className="InstanceLigue">
                  <a href="https://foot-centre.fff.fr//">
                    <h3>Ligue Centre-Val de Loire </h3>
                  </a>
                </Popup>
              </Marker>
              <Marker position={[47.11563, 2.35849]} icon={cherMarqueur}>
                <Popup className="InstancePopUp">
                  <a href="https://cher.fff.fr/">
                    <h3>District de Football du Cher </h3>
                  </a>
                </Popup>
              </Marker>
              <Marker position={[48.42918, 1.46021]} icon={eureEtLoirMarqueur}>
                <Popup className="InstancePopUp">
                  <a href="https://eure-et-loir.fff.fr/">
                    <h3>District de Football d'Eure Et Loire </h3>
                  </a>
                </Popup>
              </Marker>
              <Marker position={[46.79267, 1.69726]} icon={indreMarqueur}>
                <Popup className="InstancePopUp">
                  <a href="https://indre.fff.fr/">
                    <h3>District de Football de l'Indre </h3>
                  </a>
                </Popup>
              </Marker>
              <Marker position={[47.9168433, 1.9246721]} icon={loiretMarqueur}>
                <Popup className="InstancePopUp">
                  <a href="https://foot-loiret.fff.fr/">
                    <h3>District de Football du Loiret </h3>
                  </a>
                </Popup>
              </Marker>
              <Marker
                position={[47.5766331, 1.3026806]}
                icon={loireEtcherMarqueur}
              >
                <Popup className="InstancePopUp">
                  <a href="https://loir-et-cher.fff.fr/">
                    <h3>District de Football du Loir-et-Cher</h3>
                  </a>
                </Popup>
              </Marker>

              <Marker position={[47.37913, 0.72672]} icon={indreEtLoirMarqueur}>
                <Popup className="InstancePopUp">
                  <a href="https://indre-et-loire.fff.fr/">
                    <h3>District de Football d'Indre-Et-Loire'</h3>
                  </a>
                </Popup>
              </Marker>

              <Marker position={[47.899658, 1.87928]} icon={marqueurBanque}>
                <Popup className="banquePopUp">
                  <a href="https://www.creditmutuel.fr/fr/particuliers.html">
                    <h3>Banque du Cr??dit Mutuel</h3>
                  </a>
                </Popup>
              </Marker>
            </MapContainer>

            <div className="markerLegend">
              <div className="marker1">
                <img src={defaultMaker} alt="Marqueur par d??faut" />
                <p className="markerDescription"> Votre position</p>
              </div>

              <div className="marker2">
                <img
                  className="markerPicture"
                  alt="Marqueur Club"
                  src={clubMarker}
                />
                <p className="markerDescription"> Club de foot</p>
              </div>

              <div className="marker3">
                <img
                  className="markerPicture2"
                  alt="Marqueur Club lab??lis??"
                  src={label}
                />
                <p className="markerDescription"> Club labelis??</p>
              </div>

              <div className="marker4">
                <img
                  className="markerPicture2"
                  alt="Marqueur Cr??dit Mutuel"
                  src={markerCM2}
                />
                <p className="markerDescription"> Cr??dit Mutuel</p>
              </div>
            </div>
          </div>
        </main>
        <div className="legendAndForm">
          <section className="legendMapMobile">
            <p className="legend">
              Entrez votre date de naissance et la comp??tition souhait??e pour
              d??couvrir les clubs ?? proximit?? !{" "}
            </p>
          </section>

          <div
            className={
              clubSearch.length === 0 ? "filtersNoSearch" : "filtrations"
            }
          >
            <h3 className="formTitle"> ?? VOUS DE JOUER ! </h3>
            <form
              className="filtrationsWrapper"
              onSubmit={(e) => filterSearch(e)}
            >
              <div className="filtre1">
                <span className="filterTitle1">VOTRE ??GE </span>
                <TextField
                  variant="outlined"
                  label="??ge"
                  type="number"
                  margin="normal"
                  name="age"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  focused
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    placeholder: "10, 15, 30...",
                  }}
                />
              </div>

              <div className="filtre2">
                <FormControl component="fieldset" required={true}>
                  <span className="filterTitle2">GENRE :</span>
                  <RadioGroup
                    row
                    aria-label="gender"
                    defaultValue="female"
                    name="gender2"
                    error="Vous devez renseigner une comp??tition"
                    onChange={(e) => handleChange(e)}
                  >
                    <FormControlLabel
                      value="Male"
                      className="radio1"
                      control={<Radio />}
                      label="Masculin"
                    />
                    <FormControlLabel
                      className="radio1"
                      value="Female"
                      control={<Radio />}
                      label="F??minin"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              <div className="filtre4">
                <FormControl component="fieldset" required={true}>
                  <span className="filterTitle4">PRATIQUE SOUHAITEE :</span>
                  <RadioGroup
                    row
                    aria-label="type"
                    name="type"
                    error="Vous devez renseigner une comp??tition"
                    onChange={(e) => handleChange(e)}
                    required={true}
                  >
                    <FormControlLabel
                      value="Libre"
                      className="radio1"
                      control={<Radio />}
                      label="Libre"
                      title="Football en comp??tition ?? 11 joueurs"
                    />
                    <FormControlLabel
                      className="radio1"
                      value="Loisir"
                      control={<Radio />}
                      label="Loisir"
                      title="Pratique propos??e aux seniors exclusivement"
                    />
                    <FormControlLabel
                      className="radio1"
                      value="Futsal"
                      control={<Radio />}
                      label="Futsal"
                      title="Pratique propos??e aux s??niors homme et aux 17-18 masculins"
                    />
                  </RadioGroup>

                  <div className="modalDiv">
                    <Button className="modalTitle" onClick={handleOpen}>
                      <div className="btnOpenPopup">
                        <p className="btnTextPopUp">D??tails sur les cat??gories</p></div>
                    </Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box id="box" sx={style}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          <p className="modalTitle">
                            {" "}
                            Informations compl??mentaires sur les cat??gories :
                          </p>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <p className="boldText">Libre : </p>
                          <p className="popupText">
                            Football en comp??titon ?? 11 joueurs
                          </p>
                          <p className="boldText"> Loisir :</p>
                          <p className="popupText">
                            {" "}
                            Pratique propos??e aux seniors exclusivement
                          </p>

                          <p className="boldText">Futsal : </p>
                          <p className="popupText">
                            {" "}
                            Pratique propos??e aux seniors Homme et aux 17-18 ans
                            Hommes
                          </p>
                          <div onClick={handleClose} className="btnClosePopUp">
                            <p onClick={handleClose}>FERMER</p>
                          </div>
                        </Typography>
                      </Box>
                    </Modal>
                  </div>
                </FormControl>
              </div>

              <div className="filtre3">
                <span className="filterTitle3"> VOTRE VILLE </span>
                <Autocomplete
                  disablePortal
                  className="inputCity"
                  id="combo-box-demo"
                  inputValue={formData.city}
                  options={allcities}
                  noOptionsText="Pas de club disponible dans cette commune"
                  onInputChange={(event, newInputValue) => {
                    setformData({ ...formData, city: newInputValue });
                  }}
                  sx={{ width: 245 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Rechercher" />
                  )}
                />
              </div>

              <div className="btnContainer" id="test">
                <button
                  className="btnBackground"
                  id="scrollBtn"
                  type="submit"
                  onClick={scrollTop}
                >
                  <img
                    className="findclubBtn"
                    alt="trouvez votre club"
                    src={btnPicture}
                  />
                </button>
              </div>

              <div className="btnContainer" id="test2">
                <button className="btnBackground" id="scrollBtn" type="submit">
                  <img
                    className="findclubBtn"
                    alt="trouvez votre club"
                    src={btnPicture}
                  />
                </button>
              </div>
            </form>
          </div>

          <div className={clubSearch.length === 0 ? "hide" : "resultats"}>
            <p className="resultText">
              Il y a {clubSearch.length} r??sultat(s) correspondant ?? votre
              recherche{" "}
            </p>

            {clubSearch.length !== 0
              ? clubSearch.map((clubSelected, Uniqueindex) => {
                  return (
                    <div
                      className="cardResult"
                      key={Uniqueindex}
                      id="cardresult"
                    >
                      <div className="titleCardContainer">
                        <span className="titleCard" onClick={scrollTop}>
                          {clubSelected.NomClub}
                        </span>
                      </div>

                      <div className="columnContainer">
                        <div className="column1">
                          <div className="logo1"></div>
                          <div className="logo2"></div>
                          <div className="logo3"></div>
                        </div>
                        <div className="column2">
                          <div className="info1">
                            {" "}
                            <a
                              className="mail"
                              href={`mailto:${clubSelected.Mail}?subject=[CFB] "Entrez l'objet de votre demande "`}
                            >
                              {clubSelected.Mail}{" "}
                            </a>
                          </div>
                          <div className="info2">
                            {clubSelected.AdressePostale}
                          </div>
                          <div className="info3">
                            <a
                              href={`https://foot-centre.fff.fr/recherche-clubs/?query=${clubSelected.Localite}`}
                            >
                              Voir plus d'infos
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        <div className={clubSearch.length === 0 ? "hide" : "resultatsDesktop"}>
          <p className="resultText">
            Il y a {clubSearch.length} r??sultats correspondant ?? votre recherche{" "}
          </p>

          {clubSearch.length !== 0
            ? clubSearch.map((clubSelected, Uniqueindex) => {
                return (
                  <div className="cardResult" key={Uniqueindex}>
                    <div className="titleContainer">
                      <span className="titleCard">{clubSelected.NomClub}</span>
                    </div>

                    <div className="columnContainer">
                      <div className="column1">
                        <div className="logo1"></div>
                        <div className="logo2"></div>
                        <div className="logo3"></div>
                      </div>
                      <div className="column2">
                        <div className="info1">
                          <a
                            className="mail"
                            href={`mailto:${clubSelected.Mail}?subject=[CFB] "Entrez l'objet de votre demande "`}
                          >
                            {" "}
                            {clubSelected.Mail}{" "}
                          </a>{" "}
                        </div>
                        <div className="info2">
                          {clubSelected.AdressePostale}
                        </div>
                        <div className="info3">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://foot-centre.fff.fr/recherche-clubs/?query=${clubSelected.Localite} `}
                          >
                            Voir plus d'infos{" "}
                          </a>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>

      {/* <div className="creditMutuel" id="logo">
        <a href="https://www.creditmutuel.fr/home/index.html" target="_blank" rel="noreferrer">
          <p className="logoDescription"> Plateforme soutenue par le Cr??dit Mutuel</p>
          <img className="creditLogo" alt="logo Cr??ditMutuel" src={CM} /></a>
          <div className="linksCM">
            <div className="linklogoCM1">
              <a href="https://www.creditmutuel.fr/home/index.html" target="_blank " rel="noreferrer">
              <img src={webCM} alt="logo site web Cr??dit Mutuel" className="logowebCM"/>

              </a>
              </div>
            
            <div className="linklogoCM2">
              <a href="https://www.facebook.com/creditmutuel" target="_blank" rel="noreferrer">
              <img src={fbCM} alt="logo Facebook Cr??dit Mutuel" className="logowebCM"/></a>


            </div>
          </div>
      </div>  */}
      <div className="footHeure">
        <div className="logos">
          <a
            href="https://www.facebook.com/LCFofficiel/?ref=bookmarks"
            target="_blank"
            rel="noreferrer"
          >
            <img className="logos" alt="logo Facebook" src={fb} />
          </a>
        </div>

        <div className="logos">
          <a
            href="https://foot-centre.fff.fr/wp-content/uploads/sites/9/prehome/prehome/index.html"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="logos"
              alt="logo site Ligue Centre Val de Loire"
              src={web}
            />
          </a>
        </div>

        <div className="logos">
          <a
            href="https://www.youtube.com/channel/UCs6RtJ9tefoU0iRnTkNzD6Q"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="logos"
              alt="logo Youtube Ligue Centre-Val de Loire"
              src={yt}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Mobile3;
