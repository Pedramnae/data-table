import data from './data/data.json'
import { useEffect, useState } from 'react'
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForwardSharp } from "react-icons/io5";

function App() {

  const [jsonData, setJsonData] = useState(null);
  const [keys, setKeys] = useState()
  const [pagination, setPagination] = useState(1)
  const [inputvalue, setInputvalue] = useState("")
  const [search, setSearch] = useState()


  useEffect(() => {
    setJsonData(data)
    setSearch(data)
    setKeys(Object.keys(data[0]))
  }, [])

  useEffect(() => {
    if (inputvalue.trim() === "") {
      setSearch(jsonData);
    } else {
      const lowercasedSearch = inputvalue.toLowerCase();
      const filtered = jsonData.filter((item) =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(lowercasedSearch)
        )
      );
      setSearch(filtered);
      setPagination(1);
    }
  }, [inputvalue, jsonData])


  const handlePrevNext = (e) => {
    let name = e.currentTarget.getAttribute('data-name')
    if (name === 'prev') {
      if (pagination - 5 >= 0) {
        setPagination(pagination - 5)
      }
    }
    else {
      if (pagination + 5 <= jsonData.length) {
        setPagination(pagination + 5)
      }
    }
  }

  const handleFileUpload = (event) => {
    setPagination(1)
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          const type = Jsoncheck(content);
          if (type === "array") {
            setJsonData(content);
            setSearch(content)
            setKeys(Object.keys(content[0]))
          } else if (type === "object") {
            alert('ساختار فایل آپلود شده باید آرایه ای از اشیاء باشد')
          }
        } catch (error) {
          alert("فایل انتخابی JSON معتبر نیست.");
        }
      };
      reader.readAsText(file);
    }
  };

  const Jsoncheck = (json) => {
    if (Array.isArray(json)) {
      return "array";
    } else if (typeof json === "object" && json !== null) {
      return "object";
    }
  };


  return (
    <>
      <section className='w-full h-fit p-y-[40px] flex flex-wrap content-center justify-center'>
        <div className='w-full md:w-[75%] h-fit flex p-[15px] bg-[#654bf7a3]'>
          <input type="text" className='w-full px-[20px] py-[5px] rounded-[10px] text-[#644bf7] outline-[#644bf7]' placeholder='search...' value={inputvalue} onChange={(e) => setInputvalue(e.target.value)} />
        </div>
        <div className='w-full md:w-[75%] h-fit border'>

          {/* هدرها */}
          <ul className='w-full h-fit flex flex-wrap bg-[#644bf7]'>
            {keys && keys.map((item, index) => {
              return (
                <li key={index} style={{ width: `${100 / keys.length}%` }} className='flex h-fit py-[10px] items-center justify-center font-bold text-white uppercase '>{item}</li>
              )
            })}
          </ul>

          {/* مقادیر  */}
          <ul className='w-full h-fit flex flex-wrap bg-[#654bf7a3] content-start'>
            {search && search.map((item, index) => {
              if (index + 1 >= pagination && index + 1 < pagination + 5) {
                return (<li className='w-full h-fit flex flex-wrap items-center border-b' key={index}>
                  {Object.keys(item).map((key) => (
                    <div style={{ width: `${100 / keys.length}%` }} className='flex h-fit py-[15px] items-center justify-center text-white text-[10px] md:text-[14px]' key={key}>
                      {item[key]}
                    </div>
                  ))}
                </li>)
              }
            })}
          </ul>

        </div>
        <div className='w-full md:w-[75%] h-[70px] bg-[#644bf7] flex items-center justify-center'>

          <div data-name='prev' onClick={handlePrevNext} className='px-[15px] text-[25px] text-white cursor-pointer'><IoCaretBack /></div>
          <input type="file" accept='application/json' onChange={handleFileUpload} className='w-fit bg-[#321bb0] rounded-[10px] text-white' />
          <div data-name='next' onClick={handlePrevNext} className='px-[15px] text-[25px] text-white cursor-pointer'><IoCaretForwardSharp /></div>

        </div>
      </section>
    </>
  )
}

export default App




