import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function CreateUser({ user, onFieldChange }) {

  return (
    <Box component="div">
      {
        user &&
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
              value={user.name}
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
              value={user.email}
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
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="status"
                name="status"
                label="Status"
                value={(user.status) ? user.status : user.status = "Pending"}
                onChange={onFieldChange}
                required
              >
                <MenuItem value={"Approved"}>Approved</MenuItem>
                <MenuItem value={"Pending"}>Pending</MenuItem>
                <MenuItem value={"Rejected"}>Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} sm={6} md={6}>
            <TextField
              required
              id="password"
              label="Password"
              value={user.password}
              variant="standard"
              onChange={onFieldChange}
              fullWidth
              inputProps={{
                maxLength: 30,
                minLength: 2,
              }}
            />
          </Grid>
        </Grid>
      }
    </Box>
  );
}

export default CreateUser;
