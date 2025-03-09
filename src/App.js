
import { useEffect, useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

// or less ideally
import { Button, Col, Container, Form, InputGroup, Row, Spinner, Table } from 'react-bootstrap';

function App() {



  const myHeaders = new Headers();

  const [data, setData] = useState([])
  const [input, setInput] = useState('')
  const [dataPerPage, setDataPerPage] = useState(20)


  const [pagination, setPagination] = useState(1);

  const [initialCount, setInitialCount] = useState(1);



  const [downloadData, setDownloadData] = useState([])

  const [downloadPage, setDownloadPage] = useState(1)
  const [downloadError, setDownloadError] = useState(false)

  const [fileName, setFileName] = useState("Reports");

  const [loader, setLoader] = useState(false)

  const [totalHolder, setTotalHolder] = useState(0)








  const exportToCSV = () => {
    let csvData = downloadData
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx', type: 'array'
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);

    setDownloadData([])
    setDownloadPage(1)
    setDownloadError(false)
  }



  const search = (type,isPaginiation) => {

    let localPagination = 1
    let localDataPerPage = 20

    if (!input) {
      return;
    }
    if (type == 1) {
      localPagination = pagination
      localDataPerPage = dataPerPage
      if(!isPaginiation){
         setLoader(true)
      setData([])
      setPagination(1)
      }
     
     
    } else if (type == 2) {
      localPagination = downloadPage
      localDataPerPage = 50
    }

    myHeaders.append("accept", "application/json");
    myHeaders.append("x-api-key", "2ttArX4zXtdAB8XIHNhueT8MnTO");
    //0xdd23adE69Fc2FE1934AA36C5aB12F6DC58a3446f
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
  
    
    fetch(`https://api.blockvision.org/v2/monad/collection/holders?contractAddress=${input}&pageIndex=${localPagination}&pageSize=${localDataPerPage}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let data = JSON.parse(result).result?.data
        let totalCount =  JSON.parse(result).result?.total
        if (data) {
          if (type == 1) {
            setData(data)
            setLoader(false)
            setTotalHolder(totalCount)
          } else if (type == 2) {
            if (data.length > 0) {
              let tempdata = [...downloadData, ...data]
              setDownloadData(tempdata)
            } else {
              exportToCSV()
              setLoader(false)
            }

          }

          console.log(data)
        } else {
          if (type == 1) {
            setData([])
            setTotalHolder(0)
            setLoader(false)
          } else if (type == 2) {
            setDownloadError(true)
            exportToCSV()
            setLoader(false)
          }

        }

      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
        if (type == 1) {
          setTotalHolder(0)
          setData([])
        } else if (type == 2) {
          setDownloadError(true)
          exportToCSV()
        }

      });


  }



  const paginationCall = (type) => {


    if (type == 1) {
      if (pagination > 1) {
        setPagination(pagination - 1)
      }

    } else if (type == 2) {
      setPagination(pagination + 1)
    }
  }


  useEffect(() => {

    setInitialCount(dataPerPage * pagination)
    setData([])
    search(1,true)
  }, [pagination])


  useEffect(() => {

    if (downloadData.length > 0) {
      setDownloadPage(downloadPage + 1)
    }



  }, [downloadData])

  useEffect(() => {
    if (downloadPage > 1) {
      search(2)
    }

  }, [downloadPage])

  const downlaod = (currentPage) => {
    setLoader(true)
    search(2)
  }

  console.log(downloadData, 'mmmmmmm')

  return (
    <>
      <Container style={{ paddingBottom: '50px',position:'relative' }}>
        <Row>
          <Col lg={12} className='header'>
            <svg xmlns="http://www.w3.org/2000/svg" width="126" height="24" viewBox="0 0 126 24" fill="none" aria-label="Monad Logo"><path d="M11.782 0C8.37963 0 0 8.53443 0 11.9999C0 15.4654 8.37963 24 11.782 24C15.1844 24 23.5642 15.4653 23.5642 11.9999C23.5642 8.53458 15.1845 0 11.782 0ZM9.94598 18.8619C8.51124 18.4637 4.65378 11.5912 5.04481 10.1299C5.43584 8.66856 12.1834 4.73984 13.6181 5.1381C15.0529 5.5363 18.9104 12.4087 18.5194 13.87C18.1283 15.3314 11.3807 19.2602 9.94598 18.8619Z" fill="#836EF9"></path><path d="M40.0336 14.6596V14.6552L33.339 2.07919C33.2072 1.83164 32.843 1.89093 32.7935 2.16797L29.4595 20.8455C29.4268 21.0285 29.5649 21.197 29.7476 21.197H32.3271C32.4686 21.197 32.5899 21.0939 32.6151 20.9521L34.5567 10.0541L39.7754 20.1872C39.8851 20.4001 40.1843 20.4001 40.294 20.1872L45.5127 10.0541L47.4543 20.9521C47.4795 21.0939 47.6008 21.197 47.7423 21.197H50.3218C50.5045 21.197 50.6425 21.0285 50.6099 20.8455L47.2759 2.16797C47.2264 1.89093 46.8622 1.83164 46.7304 2.07919L40.0336 14.6596Z" fill="#FBFAF9"></path><path d="M61.4561 2.43127C56.1457 2.43127 51.9858 6.63421 51.9858 12.0007C51.9858 17.3673 56.1457 21.5726 61.4561 21.5726C66.7526 21.5726 70.9022 17.3684 70.9022 12.0007C70.9022 6.63304 66.7526 2.43127 61.4561 2.43127ZM61.4561 18.3683C57.9931 18.3683 55.28 15.571 55.28 12.0007C55.28 8.43046 57.9931 5.63551 61.4561 5.63551C64.9052 5.63551 67.608 8.43163 67.608 12.0007C67.608 15.5699 64.9052 18.3683 61.4561 18.3683Z" fill="#FBFAF9"></path><path d="M85.4983 14.1957L74.394 2.02247C74.2129 1.82394 73.8867 1.95445 73.8867 2.22543V20.8989C73.8867 21.0636 74.0178 21.1971 74.1795 21.1971H76.864C77.0257 21.1971 77.1567 21.0636 77.1567 20.8989V9.78456L88.2365 21.9807C88.4174 22.1799 88.7442 22.0495 88.7442 21.7782V3.10474C88.7442 2.94005 88.6131 2.80655 88.4514 2.80655H85.7911C85.6294 2.80655 85.4983 2.94005 85.4983 3.10474V14.1957Z" fill="#FBFAF9"></path><path d="M91.5906 21.1971H94.4731C94.5873 21.1971 94.691 21.1295 94.7389 21.024L96.8982 16.261H103.803L105.914 21.0217C105.961 21.1285 106.066 21.1971 106.181 21.1971H109.308C109.524 21.1971 109.666 20.9672 109.572 20.7692L100.713 2.09692C100.607 1.87232 100.292 1.87232 100.186 2.09692L91.327 20.7692C91.2331 20.9672 91.3747 21.1971 91.5906 21.1971ZM98.2519 13.3058L100.398 8.56257L102.504 13.3058H98.2519Z" fill="#FBFAF9"></path><path d="M116.57 2.80627H112.14C111.978 2.80627 111.847 2.93978 111.847 3.10446V20.8986C111.847 21.0633 111.978 21.1968 112.14 21.1968H116.57C122.061 21.1968 125.474 17.6733 125.474 12.0004C125.474 6.32744 122.061 2.80627 116.57 2.80627ZM116.57 18.0417H115.141V5.93685H116.57C120.135 5.93685 122.18 8.14707 122.18 12.0004C122.18 15.8396 120.135 18.0417 116.57 18.0417Z" fill="#FBFAF9"></path></svg>

          </Col>

          <Col lg={8} style={{ marginTop: '50px' }}>


            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Contract Address"
                aria-label="Contract Address"
                aria-describedby="search"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <Button variant="primary" id="search" onClick={() => search(1)}>
                SEARCH
              </Button>
            </InputGroup>
          </Col>


          <Col lg={6} style={{color:'white'}}><span>Total Holders: </span> <span style={{fontWeight:'bold'}}>{totalHolder}</span></Col>
          <Col lg={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            <Button variant="success" onClick={() => downlaod(1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
              </svg> {' '}
              Download
            </Button>
          </Col>


          <Col lg={12}>
            <Table responsive>
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>Owner Address</th>
                  <th>Unique Tokens</th>
                  <th>Last Transaction</th>
                  <th>Percentage</th>
                  <th>Value</th>

                </tr>
              </thead>
              <tbody>
                {data.map((currentData, index) => {

                  return (
                    <tr>
                      <td>{(initialCount - dataPerPage) + (index + 1)}</td>
                      <td>{currentData.ownerAddress}</td>
                      <td>{currentData.uniqueTokens}</td>
                      <td>{currentData.lastTransaction}</td>
                      <td>{currentData.percentage}</td>
                      <td>{currentData.value}</td>
                    </tr>
                  )

                })}

              </tbody>
            </Table>

          </Col>




          <Col lg={6} className='prev' onClick={() => { paginationCall(1) }}>Previous</Col>
          <Col lg={6} className='next' onClick={() => { paginationCall(2) }}>Next</Col>
        </Row>



                  {
                    loader && <Spinner animation="border" variant="info"  className='loader'>
                    <span className="visually-hidden">Loading...</span>
          
                        </Spinner>
                  }
       
          
       
       

      </Container>




    </>
  );
}

export default App;
