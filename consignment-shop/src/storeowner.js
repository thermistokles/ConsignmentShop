import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, TextField, Card, CardContent } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './style.css'; 

function StoreOwner() {

    const [inventoryData, setInventoryData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showInventory, setShowInventory] = useState(false);
    const [showAddComputerForm, setShowAddComputerForm] = useState(false);

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedMemory, setSelectedMemory] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [selectedProcessor, setSelectedProcessor] = useState('');
    const [selectedProcessGen, setSelectedProcessGen] = useState('');
    const [selectedGraphics, setSelectedGraphics] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const username = localStorage.getItem('username')
      const password = localStorage.getItem('password')

      if (username && password) {
        setUsername(username)
        setPassword(password)
      }
      else {
        navigate("/login")
      }

      const date = new Date();
      if (date.getHours() < 12) {
        setGreeting('Good Morning, ');
      } else if (date.getHours() < 17) {
        setGreeting('Good Afternoon, ');
      } else {
        setGreeting('Good Evening, ');
      }
    },[]);

    const fetchData = async (action) => {
      try {
          const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action)
          });
          return await response.json();
      } catch (error) {
          console.error(`Error during ${action}:`, error);
          return null;
      }
    };

    async function generateInventoryReport(ownerId) {

        console.log('Owner ID: ',ownerId);

        const requestBody = { body : JSON.stringify({
            action: "getAllComputers",
            userID: ownerId,
            })
        };

        const responseData = await fetchData(requestBody);

        console.log('Response data from Generate inventory: ',responseData);
        
        if (responseData.statusCode === 200) {
            console.log('Computer fetched:', responseData);
            const responseBody = JSON.parse(responseData.body);
            const computerList = responseBody.computerList;
            setInventoryData(computerList);
            const total = computerList.reduce((acc, computer) => acc + parseFloat(computer.price || 0), 0);
            setTotalPrice(total);
            setShowInventory(true);
            console.log('Total inventory: ',total);
            console.log('Computer List: ', computerList)
        } else {
            console.log('Failed to get computers:', responseData);
        }
    }

    async function addComputer() {
        const brand = selectedBrand
        const computer_name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        //const memory = document.getElementById('memory').value;
        //const storage = document.getElementById('storage').value;
        //const processor = document.getElementById('processor').value;
        //const processorGeneration = document.getElementById('processorGeneration').value;
        //const graphics = document.getElementById('graphics').value;
        const memory = selectedMemory
        const storage = selectedStorage
        const processor = selectedProcessor
        const processorGeneration = selectedProcessGen
        const graphics = selectedGraphics

        const computerDetails = {
            brand,
            computer_name,
            price,
            memory,
            storage,
            processor,
            processorGeneration,
            graphics
        };

        console.log("computerDetails: ", computerDetails)
        const requestBody = { body : JSON.stringify({
            action: "addComputer",
            credentials: password,
            username: username,
            computerDetails
            })
        };

        const responseData = await fetchData(requestBody);

        console.log('Response data from Add computer: ',responseData);

        if (responseData.statusCode === 200) {
            document.getElementById('addComputerMessage').innerText = 'Computer added successfully!';
            console.log('Computer added: ', responseData);
            document.getElementById('name').value = '';
            document.getElementById('price').value = ''; 
            setSelectedBrand('');
            setSelectedMemory('');
            setSelectedGraphics('');
            setSelectedProcessGen('');
            setSelectedProcessor('');
            setSelectedStorage('');
        } else {
            document.getElementById('addComputerMessage').innerText = responseData.message || 'Failed to add computer. Please try again. Try different username';
        }
    }

    async function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/customer');
    }

    return (
      <div style={{ display: 'flex' }}>
      <Container maxWidth="md" style={{ flex: 1 }}>
      {/* <Card>
        <CardContent> */}
          <Typography variant="h4" gutterBottom style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {greeting} <span id="ownerName">{username}!</span>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={() => {
              if(showAddComputerForm)
                {setShowAddComputerForm(false)}
              else
                {setShowAddComputerForm(true)}; 
              setShowInventory(false)}}>
            Add Computer
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}>
            Modify Price or Delete Computer
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={() => {generateInventoryReport(username);setShowAddComputerForm(false)}}>
            Generate Inventory
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={logout}>
            Logout
          </Button>
          {/* </CardContent>
          </Card> */}
          </Container>
          
          <Container maxWidth="md" style={{ flex: 1, minHeight: '600px' }}>
          {/* <Card>
          <CardContent> */}
          <div
            id="addComputerForm"
            className="form"
            style={{ display: showAddComputerForm ? 'block' : 'none' }}
          >
            <Typography variant="h5" gutterBottom>
              Add Computer
            </Typography>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="brand" required>Brand</InputLabel>
              <Select
                label="Brand"
                id="brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                required>
                <MenuItem key="Dell" value="Dell"> Dell</MenuItem>
                <MenuItem key="HP" value="HP"> HP</MenuItem>
                <MenuItem key="Lenovo" value="Lenovo"> Lenovo</MenuItem>
                <MenuItem key="Apple" value="Apple"> Apple</MenuItem>
                <MenuItem key="Acer" value="Acer"> Acer</MenuItem>
                <MenuItem key="Asus" value="Asus"> Asus</MenuItem>
                <MenuItem key="Toshiba" value="Toshiba"> Toshiba</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              id="name"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              id="price"
              required
              margin="normal"
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="memory" required>Memory</InputLabel>
              <Select
                label="Memory"
                id="memory"
                value={selectedMemory}
                onChange={(e) => setSelectedMemory(e.target.value)}
                required>
                <MenuItem key="1" value="1GB">1GB</MenuItem>
                <MenuItem key="4" value="4GB">4GB</MenuItem>
                <MenuItem key="8" value="8GB">8GB</MenuItem>
                <MenuItem key="12" value="12GB">12GB</MenuItem>
                <MenuItem key="16" value="16GB">16GB</MenuItem>
                <MenuItem key="32" value="32GB">32GB</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="storage" required>Storage</InputLabel>
              <Select
                label="Storage"
                id="storage"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                required>
                <MenuItem key="128" value="128GB">128GB</MenuItem>
                <MenuItem key="256" value="256GB">256GB</MenuItem>
                <MenuItem key="512" value="512GB">512GB</MenuItem>
                <MenuItem key="1" value="1TB">1TB</MenuItem>
                <MenuItem key="2" value="2TB">2TB</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="processor" required>Processor</InputLabel>
              <Select
                label="Processor"
                id="processor"
                value={selectedProcessor}
                onChange={(e) => setSelectedProcessor(e.target.value)}
                required>
                <MenuItem key="xion" value="Intel Xion">Intel Xion</MenuItem>
                <MenuItem key="i9" value="Intel i9">Intel i9</MenuItem>
                <MenuItem key="i7" value="Intel i7">Intel i7</MenuItem>
                <MenuItem key="r9" value="AMD Ryzen 9">AMD Ryzen 9</MenuItem>
                <MenuItem key="r7" value="AMD Ryzen 7">AMD Ryzen 7</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="processGeneration" required>Process Generation</InputLabel>
              <Select
                label="Process Generation"
                id="processGeneration"
                value={selectedProcessGen}
                onChange={(e) => setSelectedProcessGen(e.target.value)}
                required>
                <MenuItem key="13i" value="13th Gen Intel">13th Gen Intel</MenuItem>
                <MenuItem key="12i" value="12th Gen Intel">12th Gen Intel</MenuItem>
                <MenuItem key="11i" value="11th Gen Intel">11th Gen Intel</MenuItem>
                <MenuItem key="7r" value="AMD Ryzen 7000 Series">AMD Ryzen 7000 Series</MenuItem>
                <MenuItem key="6r" value="AMD Ryzen 6000 Series">AMD Ryzen 6000 Series</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="graphics" required>Graphics</InputLabel>
              <Select
                label="Graphics"
                id="graphics"
                value={selectedGraphics}
                onChange={(e) => setSelectedGraphics(e.target.value)}
                required>
                <MenuItem key="nv90" value="NVIDIA GeForce RTX 4090">NVIDIA GeForce RTX 4090</MenuItem>
                <MenuItem key="nv80" value="NVIDIA GeForce RTX 4080">NVIDIA GeForce RTX 4080</MenuItem>
                <MenuItem key="amd63" value="AMD Radeon Pro W6300">AMD Radeon Pro W6300</MenuItem>
                <MenuItem key="amd64" value="AMD Radeon Pro W6400">AMD Radeon Pro W6400</MenuItem>
                <MenuItem key="ii" value="Intel Integrated Graphics">Intel Integrated Graphics</MenuItem>
                <MenuItem key="i730" value="Intel UHD Graphics 730">Intel UHD Graphics 730</MenuItem>
                <MenuItem key="i770" value="Intel UHD Graphics 770">Intel UHD Graphics 770</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={addComputer}>
              Add Computer
            </Button>
            <Typography variant="body1" color="error" gutterBottom id="addComputerMessage"></Typography>
          </div>
        {/* </CardContent>
      </Card> */}
      {showInventory ? (
        inventoryData.length > 0 ? (
                <TableContainer component={Paper} style={{ marginTop: 20}}>
                    <Table aria-label="inventory table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Brand</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Memory</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Storage</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Processor</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Process Generation</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Graphics</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventoryData.map((computer, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {computer.computer_name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.brand}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.memory}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.storage}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.processor}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.process_generation}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.graphics}
                                    </TableCell>
                                    <TableCell align="center">${computer.price}</TableCell>
                                </TableRow>
                            ))}
                            {/* Total Price Row */}
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Total Inventory</strong>
                                </TableCell>
                                <TableCell align="right"><strong>${totalPrice.toFixed(2)}</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: 50 }}>
            No computers available.
          </Typography>
        )
      ) : (
        <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: 20 }}>
          
        </Typography>
      )}
    </Container>
    </div>
); 
}

export default StoreOwner;
