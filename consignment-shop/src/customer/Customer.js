import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './customer.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';

function Customer(){
    const [buyComputer, setBuyComputer] = useState(null)
    const [computerList, setComputerList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [memoryList, setMemoryList] = useState([])

    // storageList, processorList, processGenList, graphicsList
    const [storageList, setStorageList] = useState([])
    const [processorList, setProcessorList] = useState([])
    const [processGenList, setProcessGenList] = useState([])
    const [graphicsList, setGraphicsList] = useState([])
    const [successMessage, setSuccessMessage] = useState('');

    // searchbar
    const [searchInput, setSearchInput] = useState("");
    const [selectedValue, setSelectedValue] = React.useState('');

    const searchBar = () => {}

    useEffect(() => {
        // Call the displayAllComputers function when the component mounts
        displayAllComputers();
        displayFilter();
    }, []);

    const handleRadioChange = (event) =>{
        setBuyComputer(event.target.value);
    }

    async function displayFilter(){
        const requestBody = { body : JSON.stringify({
            action: "displayFilter"
            })
        };
        try{
            const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            console.log(responseData);

            if (responseData.statusCode === 200) {
                const parsedList = JSON.parse(responseData.body);
                //console.log("Parsed filter list: ",parsedList);
                // storageList, processorList, processGenList, graphicsList
                setBrandList(parsedList.brandList);
                setMemoryList(parsedList.memoryList);
                setStorageList(parsedList.storageList);
                setProcessorList(parsedList.processorList);
                setProcessGenList(parsedList.processGenList);
                setGraphicsList(parsedList.graphicsList);
            } else {
                console.log('Failed');
            }
        }catch(error){
            console.log('Error fetching filters ',error);
        }
    }

    async function displayAllComputers(){
        const requestBody = { body : JSON.stringify({
            action: "displayAllComputers"
            })
        };
        try{
            const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            console.log(responseData);

            if (responseData.statusCode === 200) {
                const parsedList = JSON.parse(responseData.body);
                console.log("Parsed list: ",parsedList);
                setComputerList(parsedList.computerList);
            } else {
                console.log('Failed');
            }

        }catch(error){
            console.log('Error fetching computer list ',error);
        }

    }

    async function buyComputerAction(){
        if(buyComputer){
            
            const requestBody = { body : JSON.stringify({
                action:'buyComputer',
                computer_id : buyComputer
                })
            }; 

            console.log("Computer to be sold ",requestBody.computer_id);

            try{
                const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
                });

                const responseData2 = await response.json();

                console.log(responseData2);

                if(responseData2.statusCode === 200){
                    console.log('Sold the computer', responseData2);
                    setSuccessMessage('Computer has been shipped!');
                    await displayAllComputers();
                    setBuyComputer(null);
                }else{
                    console.log('Failed to sell the computer');
                    setSuccessMessage('Failed to buy the computer.');
                }
            }catch(error){
                console.log('Failed to sell the computer', error);
                setSuccessMessage('Error occurred while trying to buy the computer.');
            }
        }
    }
    // computer_id, store_id, brand, price, memory, storage, processor, process_generation, graphics
    return(
        <><div className="flex-container">
            <div className="flex-filter">
                <p><b>Filters</b></p>
                {brandList && brandList.length > 0 ? (
                    <><table>
                        <thead>
                            <tr>
                                <th>Brand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brandList.map((brand, index) => (
                                <tr key={index}>
                                    <td><label><input type='checkbox'
                                        value={brand.brand}
                                        name='checkBrand'
                                    ></input></label>
                                    {brand.brand}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table>
                        <thead>
                            <tr>
                                <th>Memory</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memoryList.map((memory, index2) => (
                                <tr key={index2}>
                                    <td><label><input type='checkbox'
                                        value={memory.memory}
                                        name='checkMemory'
                                    ></input></label>
                                    {memory.memory}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Storage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {storageList.map((storage, index3) => (
                                <tr key={index3}>
                                    <td><label><input type='checkbox'
                                        value={storage.storage}
                                        name='checkStorage'
                                    ></input></label>
                                    {storage.storage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Processor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processorList.map((processor, index4) => (
                                <tr key={index4}>
                                    <td><label><input type='checkbox'
                                        value={processor.processor}
                                        name='checkProcessor'
                                    ></input></label>
                                    {processor.processor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Processor Generation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processGenList.map((process_generation, index5) => (
                                <tr key={index5}>
                                    <td><label><input type='checkbox'
                                        value={process_generation.process_generation}
                                        name='checkProcessGen'
                                    ></input></label>
                                    {process_generation.process_generation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Graphics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {graphicsList.map((graphics, index6) => (
                                <tr key={index6}>
                                    <td><label><input type='checkbox'
                                        value={graphics.graphics}
                                        name='checkProcessGen'
                                    ></input></label>
                                    {graphics.graphics}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 
                    </>
                ) : (
                    <p></p>
                )}
                <Button variant='contained' sx={{top: 25}}>Filter</Button>
            </div>
            
            <div className="flex-list">
            <TextField id="search" label="location" variant="filled" fullWidth/>
            <br></br>
            <br></br>
            {successMessage && <div>{successMessage}</div>}
                {computerList && computerList.length > 0 ? (
                    <><TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Computer ID</TableCell>
                          <TableCell>Store ID</TableCell>
                          <TableCell>Brand</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Memory</TableCell>
                          <TableCell>Storage</TableCell>
                          <TableCell>Processor</TableCell>
                          <TableCell>Processor Generation</TableCell>
                          <TableCell>Graphics</TableCell>
                          <TableCell>Shipping</TableCell>
                          <TableCell>Buy</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {computerList.map((computer, index) => (
                          <TableRow key={index}>
                            <TableCell>{computer.computer_id}</TableCell>
                            <TableCell>{computer.store_id}</TableCell>
                            <TableCell>{computer.brand}</TableCell>
                            <TableCell>{computer.price}</TableCell>
                            <TableCell>{computer.memory}</TableCell>
                            <TableCell>{computer.storage}</TableCell>
                            <TableCell>{computer.processor}</TableCell>
                            <TableCell>{computer.process_generation}</TableCell>
                            <TableCell>{computer.graphics}</TableCell>
                            <TableCell>1.99</TableCell>
                            <TableCell>
                              <Radio
                                checked={selectedValue === computer.computer_id}
                                onChange={handleRadioChange}
                                value={computer.computer_id}
                                name="buyComputer"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                        <Button variant='contained' onClick={() => buyComputerAction()} 
                        sx={{top: 25}}>Buy selected computer</Button>
                    </>
                ) : (
                    <p></p>
                )}
            </div>
        </div>
        <div>
        <Box textAlign='right'>
            <Button variant='contained' sx={{ position: "fixed", top: 50, right: 50, zIndex: 2000 }}>
            Show all stores
            </Button>
        </Box>
        </div>
        </>
    ) 
}
export default Customer;