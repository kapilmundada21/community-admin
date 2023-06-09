import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

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
          {
            user.status === "Rejected" &&
            <Grid item xs={2} sm={6} md={12}>
              <TextField
                required
                id="rejectionMessage"
                label="Rejection Message"
                value={(user.rejectionMessage) ? user.rejectionMessage : ""}
                variant="standard"
                onChange={onFieldChange}
                fullWidth
                inputProps={{
                  minLength: 2,
                }}
              />
            </Grid>
          }
          <Grid item xs={2} sm={6} md={12}>
            <FormControl className="space-x-4">
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                id="setPasswordType"
                name="setPasswordType"
                value={(user.setPasswordType) ? user.setPasswordType : "mail"}
                onChange={onFieldChange}
              >
                <FormControlLabel value="mail" control={<Radio />} label="send set password mail" />
                <FormControlLabel value="password" control={<Radio />} label="set password" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {
            user.setPasswordType === "password" &&
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
          }
        </Grid>
      }
    </Box>
  );
}

export default CreateUser;
