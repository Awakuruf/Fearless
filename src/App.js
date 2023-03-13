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

const center = { lat: 49.266787003907815, lng: -123.24998278685538 };
const Favorite = { lat: 49.264287311881496, lng: -123.16782315622977 };
const Recent = { lat: 49.28486655020058, lng: -123.10890169232165 };
const Home = { lat: 49.27384580417501, lng: -123.10389200076125 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isReturnVisible, setReturnVisible] = useState(false);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [now, setNow] = useState("");
  const [dangerLevel, setDangerLevel] = useState([]);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  function getDangerLevel(summary) {
    // this data was generated from the co:here api using news webscraper api
    const querySet = {
      "E Hastings St": 0.7842135419999999,
      "W Cordova St and E Hastings St": 0.825620032,
      "Powell St": 0.3738672,
      "NW Marine Dr": 0.3650033853333333,
    };
    if (querySet[summary] >= 0.75) {
      return "Danger";
    } else if (querySet[summary] >= 0.4) {
      return "Caution";
    } else {
      return "Safe Route";
    }
  }

  if (!isLoaded) {
    return <SkeletonText />;
  }
  async function calculateRoute() {
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
    setDangerLevel(
      routes.map((route) => {
        getDangerLevel(route.summary);
        console.log(
          `route summary: ${route.summary}, danger level: ${dangerLevel}`
        );
      })
    );
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setRoutes([]);
    setRouteIndex(0);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  const handleButtonClick = (index) => {
    setRouteIndex(index);
  };

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
        <HStack
          marginTop={2}
          p={2}
          borderRadius="lg"
          zIndex="1"
          spacing={[
            "150", // 0-30em
            "300", // 30em-48em
            "580", // 48em-62em
            "800", // 62em+
          ]}
        >
          <Text fontSize="2xl" as="b">
            {" "}
            Hi Kate!{" "}
          </Text>
          <Avatar name="Kate Simnac" alignItems />
        </HStack>
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
              showReturnButton();
            }}
          >
            Search!
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
            onClick={clearRoute}
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
            variant="outline"
            onClick={() => {
              map.panTo(Home);
              map.setZoom(15);
            }}
          >
            Home
          </Button>

          <Button
            leftIcon={<RxCounterClockwiseClock />}
            colorScheme="purple"
            variant="outline"
            onClick={() => {
              map.panTo(Recent);
              map.setZoom(15);
            }}
          >
            Recent
          </Button>

          <Button
            leftIcon={<MdFavoriteBorder />}
            colorScheme="purple"
            variant="outline"
            onClick={() => {
              map.panTo(Favorite);
              map.setZoom(15);
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
          spacing={1}
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          paddingBottom={65}
        >
          <Button
            leftIcon={<FaLocationArrow />}
            colorScheme="purple"
            variant="solid"
            onClick={() => {
              map.panTo(Home);
              map.setZoom(15);
            }}
          >
            Share Location
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
            }}
          >
            Fake Call
          </Button>
        </ButtonGroup>
      )}
      ;{/* Available Routes */}
      {!isVisible && (
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
                        <div>Danger Level: {getDangerLevel(route.summary)}</div>
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
      )}
      ;
    </Flex>
  );
}

export default App;
