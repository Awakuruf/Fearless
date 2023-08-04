import React, { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Logo } from './Logo';
import { OAuthButtonGroup } from './OAuthButtonGroup';
import { PasswordField } from './PasswordField';
import { CognitoUserPool } from "amazon-cognito-identity-js";


export const CognitoUILogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userpool = new CognitoUserPool({
        UserPoolId:"USERPOOL ID HERE",
        ClientId: "CLIENT ID HERE"
    });
    

    const onSubmit = (event) => {
        event.preventDefault();

        userpool.signUp(email, password, [], null, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data);
        })
    }

    return (
        <Container
            maxW="lg"
            py={{
                base: '12',
                md: '24',
            }}
            px={{
                base: '0',
                sm: '8',
            }}
        >
            <Stack spacing="8">
                <Stack spacing="6">
                    <Logo />
                    <Stack
                        spacing={{
                            base: '2',
                            md: '3',
                        }}
                        textAlign="center"
                    >
                        <Heading
                            size={{
                                base: 'xs',
                                md: 'sm',
                            }}
                        >
                            Log in to your account
                        </Heading>
                        <Text color="fg.muted">
                            Don't have an account? <Link href="#">Sign up</Link>
                        </Text>
                    </Stack>
                </Stack>
                <Box
                    py={{
                        base: '0',
                        sm: '8',
                    }}
                    px={{
                        base: '4',
                        sm: '10',
                    }}
                    bg={{
                        base: 'transparent',
                        sm: 'bg.surface',
                    }}
                    boxShadow={{
                        base: 'none',
                        sm: 'md',
                    }}
                    borderRadius={{
                        base: 'none',
                        sm: 'xl',
                    }}
                >
                    <Stack spacing="6">
                        <Stack spacing="5">
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </FormControl>
                            <FormControl>
                                <PasswordField
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </FormControl>
                        </Stack>
                        <HStack justify="space-between">
                            <Checkbox defaultChecked>Remember me</Checkbox>
                            <Button variant="text" size="sm">
                                Forgot password?
                            </Button>
                        </HStack>
                        <Stack spacing="6">
                            <Button type="submit">Sign in</Button>
                            <HStack>
                                <Divider />
                                <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                                    or continue with
                                </Text>
                                <Divider />
                            </HStack>
                            <OAuthButtonGroup />
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}

export default CognitoUILogin;
