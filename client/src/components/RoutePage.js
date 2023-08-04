import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/Mainpage';
import LoginPage from './components/LoadingComponent';
function RoutePage() {
    return (
        <VStack spacing={4} mt={4} justifyContent="space-between">
            {directionsResponse && (
                <>
                    <Text fontSize="lg" fontWeight="bold" mt={4}>
                        Available routes:
                    </Text>
                    {routes.map((route, index) => (
                        <Button
                            key={index}
                            width="auto"
                            height="auto"
                            justifyContent="flex-start"
                            textAlign="left"
                            bgColor="transparent"
                            _hover={{ bgColor: "gray.100" }}
                            onClick={() => handleButtonClick(index)}
                        >
                            <RouteButton
                                key={index}
                                streetName={route.streetName}
                                headlines={route.headlines}
                                links={route.links}
                            />
                            <VStack>
                                <Box
                                    pt={2}
                                    width="320px"
                                    height="130px"
                                    justifyContent="center"
                                >
                                    <Flex>
                                        <div>{route.legs[0].duration.text}</div>
                                        <Spacer />
                                        <div>
                                            {now} - {calculateEnd(route.legs[0].duration.value)}
                                        </div>
                                    </Flex>
                                    <Text>
                                        Route {index + 1}: {route.summary}
                                    </Text>
                                    <Box pb={2}>
                                        <div>Distance: {route.legs[0].distance.text}</div>
                                    </Box>
                                    <Alert status="success" h="30px">
                                        <AlertIcon />
                                        <div>Danger Level: {res[index]?.analysisResult || 'Unknown'}</div>
                                    </Alert>
                                </Box>
                                <div>
                                    Route {index + 1}: {route.summary}
                                </div>
                                {/* <div>Distance: {route.legs[0].distance.text}</div> */}
                                {/* <div>Duration: {route.legs[0].duration.text}</div> */}
                            </VStack>
                        </Button>
                    ))}

                    <DirectionsRenderer
                        directions={directionsResponse}
                        routeIndex={routeIndex}
                    />
                </>
            )}
        </VStack>
    )
}
;

export default RoutePage;