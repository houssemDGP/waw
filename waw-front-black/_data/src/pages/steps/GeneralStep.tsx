import { TextField, Box } from "@mui/material";

export default function GeneralStep({ formData, setFormData }) {
  return (
    <Box>
      <TextField
        fullWidth
        label="Nom de l'activité"
        value={formData.nom || ""}
        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        value={formData.description || ""}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
    </Box>
  );
}
