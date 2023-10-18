import React, { useState } from "react";
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
          <InputLabel>No de la FE</InputLabel>
          <Select>
            {fesRally.map((fe) => (
              <MenuItem key={fe.id} value={fe.id}>
                {fe.nombre}
              </MenuItem>
            ))}
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

      {/* Figma */}
      <div style={{ margin: "20px 0" }}>
        <Typography variant="h6">Figma</Typography>
        <TextField label="Nom del projecte a Figma" fullWidth margin="normal" />
      </div>

      <Button variant="contained" color="primary" onClick={handleSave}>Guardar</Button>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Se ha guardado correctamente la configuración para la herramienta.
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
