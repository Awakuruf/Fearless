import React, {useState} from 'react';
import {Box, Flex, HStack, Progress, VStack, Text, Icon} from "@chakra-ui/react";
import { MdShareLocation } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { RiSendPlaneFill } from "react-icons/ri";


function LoadingComponent() {

    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [isGeneratingRoute, setIsGeneratingRoute] = useState(true);
    const [isLastStageOfLoading, setIsLastStageOfLoading] = useState(false);

    if (isSharingLocation)
    return (
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
        >
        <Box
          p={8}
          borderRadius='lg'
          m={4}
          h='540px'
          bgColor='white'
          shadow='base'>
          <HStack spacing='8px' align='stretch'>
            <Box w='80px' h='20px' >
                <Progress colorScheme='purple' size='sm' value={100} />
            </Box>
            <Box w='80px' h='20px' >
                <Progress colorScheme='purple' size='sm' value={0} />
            </Box>
            <Box w='80px' h='20px' >
                <Progress colorScheme='purple' size='sm' value={0} />
            </Box>
          </HStack>
          <VStack>
            <Box m={8}>
                <Text fontSize={18}
                      color='purple.700'>
                    Sharing Location...
                </Text>
            </Box>
            <Box pb={8}>
                <Icon as={MdShareLocation} boxSize={24} color='purple.600'/>
            </Box>
          </VStack>
            <Box w='250px'>
              <Box pb={2}>
                <Text fontSize={12}
                      text-align='left'>
                    Safety Tip
                </Text>
              </Box>
              <Box pb={2}>
                <Text fontSize={18}>
                    Did you know...
                </Text>
              </Box>
              <Box pb={2}>
                <Text fontSize={12}>
                    that being distracted by your phone or music can make you more vulnerable to attacks?
                </Text>
              </Box>
              <Box pb={6}>
                <Text fontSize={12}>
                    Stay alert and aware of your surroundings and avoiding distractions while walking.
                </Text>
              </Box>
            </Box>
        </Box>
      </Flex>
    );

    if (isGeneratingRoute)
    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="100vh"
            w="100vw"
        >
            <Box
                p={8}
                borderRadius='lg'
                m={4}
                h='540px'
                bgColor='white'
                shadow='base'>
                <HStack spacing='8px' align='stretch'>
                    <Box w='80px' h='20px' >
                        <Progress colorScheme='purple' size='sm' value={100} />
                    </Box>
                    <Box w='80px' h='20px' >
                        <Progress colorScheme='purple' size='sm' value={100} />
                    </Box>
                    <Box w='80px' h='20px' >
                        <Progress colorScheme='purple' size='sm' value={0} />
                    </Box>
                </HStack>
                <VStack>
                    <Box m={8}>
                        <Text fontSize={18}
                              color='purple.700'>
                            Generating Route...
                        </Text>
                    </Box>
                    <Box pb={8}>
                        <Icon as={RiCustomerService2Fill} boxSize={24} color='purple.600'/>
                    </Box>
                </VStack>
                <Box w='250px'>
                    <Box pb={2}>
                        <Text fontSize={12}
                              text-align='left'>
                            Safety Tip
                        </Text>
                    </Box>
                    <Box pb={2}>
                        <Text fontSize={18}>
                            Fake call button
                        </Text>
                    </Box>
                    <Box pb={2}>
                        <Text fontSize={12}>
                            Stay safe and confident knowing you can discreetly call for help with just a tap.
                        </Text>
                    </Box>
                    <Box pb={6}>
                        <Text fontSize={12}>
                            Simply tap the button to simulate an incoming call. This can help to deter potential
                            threats and make you appear less vulnerable.
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Flex>
    );

    if (isLastStageOfLoading)
    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="100vh"
            w="100vw"
        >
            <Box
                p={8}
                borderRadius='lg'
                m={4}
                h='540px'
                bgColor='white'
                shadow='base'>
                <HStack spacing='8px' align='stretch'>
                    <Box w='80px' h='20px' >
                        <Progress colorScheme='purple' size='sm' value={100} />
                    </Box>
                    <Box w='80px' h='20px' >
                        <Progress colorScheme='purple' size='sm' value={100} />
                    </Box>
                    <Box w='80px' h='20px' >
                        <Progress colorScheme='purple' size='sm' value={100} />
                    </Box>
                </HStack>
                <VStack>
                    <Box m={8}>
                        <Text fontSize={18}
                              color='purple.700'>
                            We are almost ready!
                        </Text>
                    </Box>
                    <Box pb={8}>
                        <Icon as={RiSendPlaneFill} boxSize={24} color='purple.600'/>
                    </Box>
                </VStack>
                <Box w='250px'>
                    <Box pb={2}>
                        <Text fontSize={12}
                              text-align='left'>
                            Safety Tip
                        </Text>
                    </Box>
                    <Box pb={2}>
                        <Text fontSize={18}>
                            Alert button
                        </Text>
                    </Box>
                    <Box pb={2}>
                        <Text fontSize={12}>
                            Swipe the button to automatically send your real-time location and a distress signal to your selected contacts.
                        </Text>
                    </Box>
                    <Box pb={6}>
                        <Text fontSize={12}>
                            Navigate with confidence knowing that help is just one tap away.
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Flex>
    );

}

export default LoadingComponent;
