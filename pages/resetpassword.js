import Head from 'next/head';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios';
import { useEffect } from 'react'
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';

const theme = createTheme();

export default function Resetpassword() {
    const router = useRouter()
    const token = router.query.token;

    // useEffect(() => {
    //     let user = JSON.parse(localStorage.getItem("user"));
    //     if (user && user.token) {
    //         router.push("/")
    //     }
    // });

    const sendResetEmail = async () => {
        const data = {
            email: values.email,
            sendMail: true,
        };
        try {
            const response = await axios.post(`/api/auth/resetpassword`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success) {
                const emailData = {
                    to: values.email,
                    token: response.data.token,
                };
                try {
                    const emailResponse = await axios.post(`/api/sendgrid`, emailData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (emailResponse.data.success) {
                        toast.success('Mail has been sent successfully!', {
                            position: 'top-right',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        router.push('/login');
                    } else {
                        toast.error('500: ' + emailResponse.data.error, {
                            position: 'top-right',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.error(response.data.error, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const resetPassword = async () => {
        const data = {
            token,
            password: values.password,
            sendMail: false,
        };
        try {
            const response = await axios.post(`/api/auth/resetpassword`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success) {
                toast.success('Password has been changed Successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                router.push('/login');
            } else {
                toast.error(response.data.error, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                router.push('/resetpassword');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const initialValues = {
        email: "",
        password: "",
        cpassword: "",
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        // validationSchema: token ? resetPasswordSchema : sendRestEmailSchema,
        onSubmit: (values) => {
            token ? resetPassword() : sendResetEmail();
        }
    })

    return (
        <div>
            <Head>
                <title>{`Reset Password | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
            </Head>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <Image src="/images/clogo.png" alt="logo" height={40} width={40} />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}
                        >
                            {
                                !token &&
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            }
                            {errors.email && touched.email ? (<p className="text-red-600 text-sm">{errors.email}</p>) : null}

                            {
                                token &&
                                <div>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="New Password"
                                        type="password"
                                        id="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.password && touched.password ? (<p className="text-red-600 text-sm">{errors.password}</p>) : null}
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="cpassword"
                                        label="Conform Password"
                                        type="password"
                                        id="cpassword"
                                        autoComplete="cpassword"
                                        value={values.cpassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.cpassword && touched.cpassword ? (<p className="text-red-600 text-sm">{errors.cpassword}</p>) : null}
                                </div>
                            }

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2 !important' }}
                            >
                                {token ? 'Reset Password' : 'Continue'}
                            </Button>
                            {
                                !token &&
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="/login" className="text-blue-400" variant="body2">
                                            Login
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signup" className="text-blue-400" variant="body2">
                                            Sign Up
                                        </Link>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    )
}