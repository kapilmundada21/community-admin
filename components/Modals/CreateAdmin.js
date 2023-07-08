import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

function CreateAdmin({ admin, onFieldChange }) {

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
              name="name"
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
              name="email"
              label="Email"
              value={admin.email}
              variant="standard"
              onChange={onFieldChange}
              fullWidth
              inputProps={{
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
                value={(admin.type) ? admin.type : admin.type = "Supervisor"}
                onChange={onFieldChange}
                required
              >
                <MenuItem value={"Admin"}>Admin</MenuItem>
                <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} sm={6} md={12}>
            <FormControl className="space-x-4">
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                id="setPasswordType"
                name="setPasswordType"
                value={(admin.setPasswordType) ? admin.setPasswordType : "mail"}
                onChange={onFieldChange}
              >
                <FormControlLabel value="mail" control={<Radio />} label="send set password mail" />
                <FormControlLabel value="password" control={<Radio />} label="set password" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {
            admin.setPasswordType === "password" &&
            <Grid item xs={2} sm={6} md={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              value={admin.password}
              variant="standard"
              onChange={onFieldChange}
              fullWidth
              inputProps={{
                maxLength: 30,
                minLength: 2,
              }}
            />
            </Grid>
          }
        </Grid>
      }
    </Box>
  );
}

export default CreateAdmin;