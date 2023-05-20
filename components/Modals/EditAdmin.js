import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function EditAdmin({ admin, onFieldChange }) {

  return (
    <Box component="div">
      {
        admin &&
        <Grid
          container
          padding={3}
          spacing={4}
          columns={{ xs: 2, sm: 6, md: 12 }}
        >
          <Grid item xs={2} sm={6} md={6}>
            <TextField
              required
              id="name"
              label="Name"
              value={admin.name}
              variant="standard"
              onChange={onFieldChange}
              fullWidth
              inputProps={{
                maxLength: 50,
                minLength: 2,
              }}
            />
          </Grid>
          <Grid item xs={2} sm={6} md={6}>
            <TextField
              required
              type="email"
              id="email"
              label="Email"
              value={admin.email}
              variant="standard"
              onChange={onFieldChange}
              fullWidth
              inputProps={{
                readOnly: true,
                maxLength: 50,
                minLength: 5,
              }}
            />
          </Grid>
          <Grid item xs={2} sm={6} md={6}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="type"
                name="type"
                label="Type"
                value={admin.type}
                onChange={onFieldChange}
              >
                <MenuItem value={"Admin"}>Admin</MenuItem>
                <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      }
    </Box>
  );
}

export default EditAdmin;
