import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Icon,
    Input,
    SkeletonText,
    Text,
    VStack,
    Avatar,
    Alert,
    AlertIcon,
    Spacer,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiTargetLock, BiPhoneCall } from "react-icons/bi";
import { AiOutlineHome, AiOutlineLeft } from "react-icons/ai";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { MdFavoriteBorder } from "react-icons/md";
import { HiBellAlert } from "react-icons/hi2";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
// const fetchData = require('./AWS/newscatcherBrowser.js');
import fetchData from "../AWS/newscatcherBrowser.js";
import runComprehend from "../AWS/comprehend_aws.js";
import { useNavigate } from "react-router-dom";
import LoadingComponent from './LoadingComponent';
import RouteLinkButton from './RouteLinkButton.js';


const dummy_array = [
    { streetName: 'York St', headlines: [] },
    { streetName: 'York St and King St W', headlines: [] },
    {
        streetName: 'King St',
        headlines: [
            "This advertisement has not loaded yet, but your article continues below. Hundreds of tenants and community members marched down Weston Road to protest rent increases at 33 King St. and 22 John St. in Toronto on July 15. Photo by YSW Tenant Union / Twitter Hundreds of renters have gone on strike in Toronto and are refusing to pay their landlords.",
            "WARNING: This video contains sensitive content, which some may find disturbing. Toronto police have released a shocking video that shows a bicycle cop who was struck by a stolen vehicle last weekend. The incident happened at the intersection of Jameson Ave. and King St."
        ]
    },
    { streetName: 'University Ave', headlines: [] }
];

const center = { lat: 49.266787003907815, lng: -123.24998278685538 };
const Favorite = { lat: 49.264287311881496, lng: -123.16782315622977 };
const Recent = { lat: 49.28486655020058, lng: -123.10890169232165 };
const Home = { lat: 49.27384580417501, lng: -123.10389200076125 };

function Mainpage({ signOut, userAttributes }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const [map, setMap] = useState(/** @type google.maps.Map */(null));
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isReturnVisible, setReturnVisible] = useState(false);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [now, setNow] = useState("");
    const [res, setRes] = useState([]);
    const [news, setNews] = useState([]);
    const [isVStackVisible, setVStackVisible] = useState(true);
    const [showLink, setShowLink] = useState(false);
    const [showRouteDetails, setShowRouteDetails] = useState(true);




    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef();

    const navigate = useNavigate();
    const [isCalculating, setIsCalculating] = useState(false);


    const { family_name, name } = userAttributes?.attributes || {}; // Use optional chaining and provide an empty object as a default value
    const userName = family_name && name ? `${family_name} ${name}` : 'John Smith';


    if (!isLoaded) {
        return <SkeletonText />;
    }

    async function calculateRoute() {
        setIsCalculating(true); // Show the LoadingComponent
        if (originRef.current.value === "" || destinationRef.current.value === "") {
            return;
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true,
        });

        setDirectionsResponse(results);
        setRoutes(results.routes);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
        getNow();

        const streetNames = [];

        routes.forEach((route) => {
            streetNames.push(route.summary);
        });

        console.log('Generated Routes:', streetNames);

        const news = []
        // Call the function to fetch data for each route using rate-limiting
        await callNewsCatcher(streetNames, news);
        await setNews(news);
        console.log("This is the headlines array:", news);

        // Call evaluateEachRoute() for each route and collect the results in an array
        const res = await evaluateEachRoute(news);
        await setRes(res);
        console.log("Final Route Evaluation", res);
        setIsCalculating(false);
        return res;
    }

    // const loadGeneratingPage = async () => {
    //     try {
    //         setIsCalculating(true); // Show the LoadingComponent
    //         navigate('/loading'); // Redirect to the LoadingComponent

    //         // Call calculateRoute() and store the result in 'res'
    //         const res = await calculateRoute();

    //         // Set the result in state (assuming res is an array of results)
    //         // setRes(res);

    //         setIsCalculating(false); // Hide the LoadingComponent
    //         setIsVisible(false); // Hide the loading screen and show the result screen
    //         navigate(-1); // Return back to the previous page once loading is done
    //     } catch (error) {
    //         setIsCalculating(false); // Hide the LoadingComponent in case of an error
    //         console.error('Error:', error);
    //     }
    // };

    async function callNewsCatcher(routes, news) {
        // Use a rate-limiting mechanism to call the API once per second for each route
        const apiCalls = routes.map((route, index) => {
            return new Promise((resolve) => {
                setTimeout(async () => {
                    const dataset = await fetchData(route, news);
                    resolve(dataset);
                }, index * 1000); // Delay the API call by index * 1000 milliseconds (1 second)
            });
        });

        // Wait for all API calls to finish and return the headlines
        const fetches_news = await Promise.all(apiCalls);
        return news;
    }

    async function evaluateEachRoute(dataset) {
        console.log("Reached evaluateEachRoute() function");
        const res = [];

        for (const route of dataset) {
            const { streetName, headlines } = route;
            if (headlines.length === 0) {
                res.push({ streetName, analysisResult: 'SAFE' });
            } else {
                const analysisCounts = { DANGER: 0, SAFE: 0 };
                for (const headline of headlines) {
                    try {
                        // Make a call to AWS Comprehend using runComprehend() function
                        const analysisResult = await runComprehend(headline);
                        console.log(`Analysis Result for headline: "${headline}" on street "${streetName}":`, analysisResult);

                        // Update the analysis counts
                        analysisCounts[analysisResult]++;
                    } catch (error) {
                        console.error(`Error analyzing headline: "${headline}" on street "${streetName}":`, error);
                    }
                }

                // Determine the majority analysis result for the street
                const majorityAnalysisResult = analysisCounts.DANGER > analysisCounts.SAFE ? 'DANGER' : 'SAFE';

                // Add the majority analysis result and streetName into the res array
                res.push({ streetName, analysisResult: majorityAnalysisResult });

                // Log the danger level for the street
                console.log(`Street Name: "${streetName}": Danger Level: "${majorityAnalysisResult}"`);
            }
        }

        return res;
    }

    const handleButtonClick = (index) => {
        setRouteIndex(index);
        setVStackVisible(false);
    };


    const showVStack = () => {
        setVStackVisible(true);
    };

    // setDangerLevel(
    //   routes.map(async (route) => {
    //     console.log(route.summary);
    //     //Invoke Lambda function with the route.summary 
    //     // Lambda API URL: https://6nbiaqnj00.execute-api.us-east-2.amazonaws.com/test1/entries
    //   })
    // );

    // setDangerLevel(
    //   routes.map(async (route) => {
    //     console.log(route.summary);
    //     const dataset = await fetchData(route.summary);
    //     // Perform any further processing with the fetched data here
    //     console.log('Fetched Data:', dataset);
    //     return dataset;
    //   })
    // );

    // // Use Promise.all to handle the asynchronous fetchData calls
    // Promise.all(
    //   routes.map(async (route) => {
    //     console.log(route.summary);
    //     const dataset = await fetchData(route.summary);
    //     // Perform any further processing with the fetched data here
    //     console.log('Fetched Data:', dataset);
    //     return dataset;
    //   })
    // )
    //   .then((data) => {
    //     setDangerLevel(data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     setDangerLevel([]);
    //   });


    function clearRoute() {
        setDirectionsResponse(null);
        setRoutes([]);
        setRouteIndex(0);
        setDistance("");
        setDuration("");
        originRef.current.value = "";
        destinationRef.current.value = "";
    }

    function getNow() {
        const today = new Date();
        let time = today.getHours() + ":" + today.getMinutes();
        if (today.getMinutes() < 10) {
            time = today.getHours() + ":0" + today.getMinutes();
        }
        setNow(time);
    }
    function calculateEnd(duration) {
        const today = new Date();
        let newDateObj = new Date(today.getTime() + duration * 1000);
        if (newDateObj.getMinutes() < 10) {
            return newDateObj.getHours() + ":0" + newDateObj.getMinutes();
        }
        return newDateObj.getHours() + ":" + newDateObj.getMinutes();
    }
    const hideBoxes = () => {
        setIsVisible(false);
    };

    const showReturnButton = () => {
        isReturnVisible(true);
        setReturnVisible(false);
    };

    while (isCalculating) {
        // Show the loading screen while isCalculating is true
        return <LoadingComponent />;
    }

    function test() {
        console.log("User Attributes in Mainpage:", userAttributes);
    }

    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="100vh"
            w="100vw"
        >
            <Box position="absolute" left={0} top={0} h="100%" w="100%">
                {/* Google Map Box */}
                <GoogleMap
                    center={center}
                    zoom={13}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                >
                    <Marker position={center} visible={false} />
                    {directionsResponse && (
                        <DirectionsRenderer
                            directions={directionsResponse}
                            routeIndex={routeIndex}
                        />
                    )}
                </GoogleMap>
            </Box>
            {
                // Greeting Stack
            }
            {isVisible && (
                <Flex
                    marginTop={2}
                    p={2}
                    backgroundColor="white"
                    borderRadius="lg"
                    zIndex="1"
                    marginBottom="5"
                    spacing={[
                        "150", // 0-30em
                        "300", // 30em-48em
                        "580", // 48em-62em
                        "800", // 62em+
                    ]}
                    alignItems="center" // Align items horizontally
                >
                    <Text fontSize="2xl" fontWeight="bold">
                        Hi {name}!
                    </Text>
                    <Avatar name={`${family_name} ${name}`} ml={500} />
                    <Button colorScheme='red' onClick={signOut} ml={2}>
                        Sign Out
                    </Button> {/* Add margin-left (ml) to separate the button from the Avatar */}
                </Flex>
            )}
            {
                // Return Button
            }
            {!isVisible && (
                <Flex
                    p={2}
                    paddingTop={30}
                    paddingLeft={25}
                    position="absolute"
                    top={0}
                    left={0}
                    align="center"
                >
                    <IconButton
                        aria-label="center back"
                        colorScheme="pink"
                        icon={<AiOutlineLeft />}
                        isRound
                        onClick={() => {
                            setIsVisible(true);
                            showVStack();
                            setShowLink(false);
                        }}
                    />
                    <Text fontSize="2xl" as="b" paddingLeft={5}>
                        {" "}
                        Your Safest Directions!{" "}
                    </Text>
                </Flex>
            )}
            {isVisible && (
                <Box
                    p={2}
                    borderRadius="lg"
                    m={1}
                    bgColor="white"
                    shadow="base"
                    zIndex="1"
                    width={[
                        "80%", // 0-30em
                        "50%", // 30em-48em
                        "25%", // 48em-62em
                        "15%", // 62em+
                    ]}
                >
                    <HStack p={0.5} borderRadius="lg" zIndex="1">
                        <Icon as={BiTargetLock} boxSize={6} />
                        <Box flexGrow={1}>
                            <Autocomplete>
                                <Input
                                    type="text"
                                    placeholder="Current Location"
                                    ref={originRef}
                                />
                            </Autocomplete>
                        </Box>
                    </HStack>
                </Box>
            )}
            ;
            {isVisible && (
                <Box
                    p={2}
                    m={1}
                    borderRadius="lg"
                    bgColor="white"
                    shadow="base"
                    zIndex="1"
                    width={[
                        "80%", // 0-30em
                        "50%", // 30em-48em
                        "25%", // 48em-62em
                        "15%", // 62em+
                    ]}
                >
                    <HStack p={0.5} borderRadius="lg" zIndex="1">
                        <Icon as={FaMapMarkerAlt} boxSize={6} />
                        <Box flexGrow={1}>
                            <Autocomplete>
                                <Input
                                    type="text"
                                    placeholder="Where To?"
                                    ref={destinationRef}
                                />
                            </Autocomplete>
                        </Box>
                    </HStack>
                </Box>
            )}
            ;
            {
                // Functionality Button Group
            }
            {isVisible && (
                <ButtonGroup spacing={5} padding={1.5}>
                    <Button
                        colorScheme="pink"
                        type="submit"
                        onClick={() => {
                            hideBoxes();
                            calculateRoute();
                            // showReturnButton();
                        }}
                    >
                        Search
                    </Button>

                    <IconButton
                        aria-label="center back"
                        colorScheme="green"
                        icon={<FaLocationArrow />}
                        isRound
                        onClick={() => {
                            map.panTo(center);
                            map.setZoom(15);
                        }}
                    />

                    <IconButton
                        aria-label="center back"
                        colorScheme="red"
                        icon={<FaTimes />}
                        onClick={test}
                    />
                </ButtonGroup>
            )}
            ; // For development purposes
            {/*<LoadingComponent/>*/}
            {
                // <HStack spacing={4} mt={4} justifyContent="space-between">
                //<Text>Distance: {distance} </Text>
                //<Text>Duration: {duration} </Text>
                //</HStack>
            }
            {
                // Cosmetic Button Group
            }
            {isVisible && (
                <ButtonGroup spacing={3} padding={1.5}>
                    <Button
                        leftIcon={<AiOutlineHome />}
                        colorScheme="purple"
                        variant="solid"
                        onClick={() => {
                            map.panTo(Home);
                            map.setZoom(15);
                            runComprehend("King Street");
                            console.log("Ran these codes too");
                        }}
                    >
                        Home
                    </Button>

                    <Button
                        leftIcon={<RxCounterClockwiseClock />}
                        colorScheme="purple"
                        variant="solid"
                        onClick={() => {
                            map.panTo(Recent);
                            map.setZoom(15);
                            callNewsCatcher(['Evans Ave.', 'Bloor St W', 'Dundas St W'], []);
                        }}
                    >
                        Recent
                    </Button>

                    <Button
                        leftIcon={<MdFavoriteBorder />}
                        colorScheme="purple"
                        variant="solid"
                        onClick={() => {
                            map.panTo(Favorite);
                            map.setZoom(15);
                            evaluateEachRoute(dummy_array);
                        }}
                    >
                        Favorite
                    </Button>
                </ButtonGroup>
            )}
            ;
            {
                // Alert Buttons
            }
            {!isVisible && (
                <ButtonGroup
                    spacing={3}
                    padding={1.5}
                    position="absolute"
                    bottom={0}
                    paddingBottom={65}
                >
                    <Button
                        leftIcon={<FaLocationArrow />}
                        colorScheme="green"
                        variant="solid"
                        onClick={() => {
                            setShowRouteDetails(!showRouteDetails);
                            setShowLink(true);
                            setIsVisible(false);
                        }}
                    >
                        Analyzed News Headlines
                    </Button>

                    <Button
                        leftIcon={<HiBellAlert />}
                        colorScheme="red"
                        variant="solid"
                        onClick={() => {
                            map.panTo(Recent);
                            map.setZoom(15);
                        }}
                    >
                        Alert
                    </Button>

                    <Button
                        leftIcon={<BiPhoneCall />}
                        colorScheme="pink"
                        variant="solid"
                        onClick={() => {
                            map.panTo(Favorite);
                            map.setZoom(15);
                            showVStack();
                        }}
                    >
                        Fake Call
                    </Button>
                </ButtonGroup>
            )}
            ;{/* Available Routes */}
            {!isVisible && isVStackVisible && showRouteDetails && (
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
                                    bgColor="cyan.100"
                                    _hover={{ bgColor: "gray.100" }}
                                    onClick={() => handleButtonClick(index)}
                                >
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
                                            {res[index]?.analysisResult === "DANGER" ? (
                                                <Alert status="error" h="30px">
                                                    <AlertIcon />
                                                    <div>Danger Level: {res[index]?.analysisResult}</div>
                                                </Alert>
                                            ) : res[index]?.analysisResult === "SAFE" ? (
                                                <Alert status="success" h="30px">
                                                    <AlertIcon />
                                                    <div>Danger Level: {res[index]?.analysisResult}</div>
                                                </Alert>
                                            ) : (
                                                <Alert status="warning" h="30px">
                                                    <AlertIcon />
                                                    <div>Danger Level: {res[index]?.analysisResult || 'Unknown'}</div>
                                                </Alert>
                                            )}
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
            {/* Link Display */}
            {showLink && (
                <VStack
                    spacing={4}
                    mt={4}
                    justifyContent="space-between"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 2,
                        padding: "20px", // You can adjust the padding as needed
                        overflow: "auto", // Add scroll bars if content exceeds the height
                        maxHeight: "50vh", // Limit the maximum height of the VStack to 80% of the viewport height
                    }}
                >
                    {directionsResponse && (
                        <>
                            {news.map((newsItem, index) => (
                                <VStack key={index}
                                    width="auto"
                                    height="auto"
                                    justifyContent="flex-start"
                                    textAlign="left"
                                    bgColor="cyan.100"
                                    _hover={{ bgColor: "gray.100" }}
                                >
                                    <Box
                                        pt={2}
                                        width="320px"
                                        height="130px"
                                        justifyContent="center"
                                    >
                                        <div>
                                            <h3>Headlines:</h3>
                                            <ul>
                                                {/* Check if the headlines array is empty */}
                                                {newsItem.headlines?.length === 0 ? (
                                                    <p>No headlines found.</p>
                                                ) : (
                                                    newsItem.headlines?.map((headline, idx) => (
                                                        <li key={idx}>{headline}</li>
                                                    ))
                                                )}
                                            </ul>
                                            <h3>Links:</h3>
                                            <ul>
                                                {/* Check if the links array is empty */}
                                                {newsItem.links?.length === 0 ? (
                                                    <p>No links found.</p>
                                                ) : (
                                                    newsItem.links?.map((link, idx) => (
                                                        <li key={idx}>
                                                            <a href={link} target="_blank" rel="noopener noreferrer">
                                                                {link}
                                                            </a>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                            <h3>Street Name:</h3>
                                            <div>{newsItem.streetName}</div>
                                        </div>
                                    </Box>
                                </VStack>
                            ))}
                        </>
                    )}
                </VStack>
            )}
        </Flex >
    );
}

export default Mainpage;


