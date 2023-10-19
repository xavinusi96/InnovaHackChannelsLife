import React, { useState, useRef } from "react";
import {
  Button,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  // Asumiendo que obtienes estos datos de una API o alguna fuente de datos
  const [espaciosConfluence] = useState([]);
  const [proyectosRally] = useState([]);
  const [iniciativasRally] = useState([]);
  const [fesRally] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [imageSrc, setImageSrc] = useState(""); // Asumo que cargarás la imagen de alguna manera
  const [jsonText, setJsonText] = useState(""); // Aquí se almacenará el texto en formato JSON
  let [dades, setDades] = useState(null);
  let [dades2, setDades2] = useState(null);

  const proyectosFigma = [
    { id: 1, nombre: "Figma 1" },
    { id: 2, nombre: "Figma 2" },
    { id: 3, nombre: "Figma 3" },
    { id: 4, nombre: "Figma 4" },
  ];

  const paginasFigma = [
    { id: 1, nombre: "Page 1" },
    { id: 2, nombre: "Page 2" },
    { id: 3, nombre: "Page 3" },
    { id: 4, nombre: "Page 4" },
  ];

  const ftoken = "figd_wV1cFmOv1Bq6oMNfJor7rDl1pCbkb4KSvLojzDi4";
  const [apiOutput, setApiOutput] = useState("");

  const getCosPagina = (o) => {
    let res = null;
    if (o["name"] == "section") return (res = o["children"]);
    else if (o["name"] == "content") return o["children"][0]["children"];
    else {
      let i = 0;
      if (o["children"]) {
        while (i < o["children"].length && res == null) {
          res = getCosPagina(o["children"][i]);
          i++;
        }
      }
    }
    return res;
  };

  const getComponent = (name) => {
    const componentsOmnia = new Array();
    componentsOmnia["$spacing-spacer"] = "OpfSpacer";
    componentsOmnia["card navigation complex"] = "OpfCardNavigationComplex";
    componentsOmnia["list standard"] = "OpfListStandardItem";
    componentsOmnia["text - body"] = "OpfText";
    let res = componentsOmnia[name];
    if (!res) res = "Opf" + name.charAt(0).toUpperCase() + name.substring(1);
    return res;
  };

  const getPropsComponent = (propietats) => {
    let props = new Array();
    for (let i in propietats) {
      let j = i.indexOf("#");
      let nom = i;
      if (j > 0) nom = i.substring(0, j);
      props.push(nom + '="' + propietats[i].value + '"');
    }
    return props;
  };

  const api = () => {
    setApiOutput("...Carregant figma...");
    const ffile = "2OgFN5TfLhvJy0BUabOTgR";
    const fids = "16691:167651";

    fetch(`https://api.figma.com/v1/files/${ffile}?ids=${fids}`, {
      method: "GET",
      headers: { "X-Figma-Token": ftoken },
    })
      .then((resp) => resp.json())
      .then((json) => tractaSortida(json));
  };

  const tractaSortida = (json) => {
    dades = json;
    let cos = getCosPagina(json["document"]);
    let pagina = new Object();
    pagina.components = new Array();
    pagina.literals = new Array();
    let res = "";
    if (cos) {
      cos.forEach((c) => {
        let comp = getComponent(c["name"]);
        let props = getPropsComponent(c["componentProperties"]);
        let ocomp = new Object();
        ocomp.name = comp;
        ocomp.props = props;
        pagina.components.push(ocomp);
        let sprops = "";
        if (props.length > 0)
          sprops = props.join(" ").replaceAll("✏️", "").replaceAll("🔁", "");
        res +=
          "<" +
          comp +
          (sprops.length > 0 ? " " + sprops : "") +
          "></" +
          comp +
          ">";
        // per cada propietat recollir les que son literals i dels literals el que sigui número que sigui una variable replace(/[^0-9]+/g,"")
        pagina.components.forEach((c) => {
          c.props.forEach((p) => {
            if (p.startsWith("✏️")) pagina.literals.push(p);
          });
        });
        console.log(JSON.stringify(pagina));
        dades2 = pagina;
      });
    }

    setApiOutput(res
    );
  };

  const handleSave = () => {
    // Lógica de guardar (si la hay)
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // TODO: Usar useEffect para cargar datos desde la API para cada desplegable
  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        CharlesTool
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {/* Apartado de Figma */}
          <div style={{ margin: "20px 0" }}>
            <Typography variant="h6">Figma</Typography>

            {/* Desplegable para Proyecto de Figma */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Proyecto de Figma</InputLabel>
              <Select>
                {proyectosFigma.map((proyecto) => (
                  <MenuItem key={proyecto.id} value={proyecto.id}>
                    {proyecto.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Desplegable para Page Figma */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Page Figma</InputLabel>
              <Select>
                {paginasFigma.map((pagina) => (
                  <MenuItem key={pagina.id} value={pagina.id}>
                    {pagina.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Confluence */}
          <div style={{ margin: "20px 0" }}>
            <Typography variant="h6">Confluence</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Nom de l'espai</InputLabel>
              <Select>
                {/* Asumiendo que los espacios tienen un id y un nombre */}
                {espaciosConfluence.map((espacio) => (
                  <MenuItem key={espacio.id} value={espacio.id}>
                    {espacio.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Títol de l'entrada/pàgina de requeriments"
              fullWidth
              margin="normal"
            />
          </div>

          {/* Rally */}
          <div style={{ margin: "20px 0" }}>
            <Typography variant="h6">Rally</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Nom del projecte Rally</InputLabel>
              <Select>
                {proyectosRally.map((proyecto) => (
                  <MenuItem key={proyecto.id} value={proyecto.id}>
                    {proyecto.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Nom de l'iniciativa</InputLabel>
              <Select>
                {iniciativasRally.map((iniciativa) => (
                  <MenuItem key={iniciativa.id} value={iniciativa.id}>
                    {iniciativa.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Nom de la FE</InputLabel>
              <Select>
                {/* {fesRally.map((fe) => ( */}
                <MenuItem>test</MenuItem>
                {/* ))} */}
              </Select>
            </FormControl>
          </div>

          {/* GitLab */}
          <div style={{ margin: "20px 0" }}>
            <Typography variant="h6">GitLab</Typography>
            <TextField
              label="Nom del projecte a GitLab"
              fullWidth
              margin="normal"
            />
          </div>

          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success">
              Se ha guardado correctamente la configuración para la herramienta.
            </Alert>
          </Snackbar>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Sección de Generar pantalla */}
          <div style={{ margin: "20px 0" }}>
            <Typography variant="h6">Generar Pantalla</Typography>
            <Button variant="contained" color="primary" onClick={api}>
              Generar pantalla a partir de Figma
            </Button>
            <br></br>
            {apiOutput}
          </div>

          {/* Sección de Literales */}
          <div style={{ margin: "20px 0" }}>
            <Typography variant="h6">Literales</Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom: "20px" }}
            >
              Generar fichero literales a partir del Figma
            </Button>
            <TextareaAutosize
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rowsMin={5}
              style={{ width: "100%" }}
              placeholder="Aquí se mostrará el JSON..."
            />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
