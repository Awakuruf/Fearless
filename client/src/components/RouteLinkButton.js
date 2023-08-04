import React, { useState } from 'react';
import { Button } from "@chakra-ui/react";

const RouteLinkButton = ({ streetName, headlines, links }) => {
    const [showLink, setShowLink] = useState(false);

    const handleButtonClick = () => {
        setShowLink(true);
    };

    return (
        <div>
            <Button
                width="auto"
                height="auto"
                justifyContent="flex-start"
                textAlign="left"
                bgColor="cyan.100"
                _hover={{ bgColor: "gray.100" }}
                onClick={handleButtonClick}
            >
                {streetName}
            </Button>
            {showLink && links.length > 0 && (
                <div>
                    <h3>Headlines:</h3>
                    {headlines.map((headline, index) => (
                        <p key={index}>{headline}</p>
                    ))}
                    <h3>Links:</h3>
                    {links.map((link, index) => (
                        <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                            Link {index + 1}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RouteLinkButton;
