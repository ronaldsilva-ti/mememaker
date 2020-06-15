import React,{ useState,useEffect } from 'react';
import qs from 'qs';
import { Wrapper, Card, Template, Form, Button} from './styles';
import logo from '../../imagens/logo.svg';


export default function  Home() {

        const [templates, setTemplates] = useState([]);
        const [selectedTemplate,setSelectedTemplate] = useState(null);    
        const [boxes, setBoxes] = useState([]);  
        const [generatedMeme,setGenerateMeme] = useState(null)  

        useEffect(() => {
           (async () => {
            const resp = await fetch ('https://api.imgflip.com/get_memes');
            const { data: { memes } } =  await resp.json();
            setTemplates(memes)
           })()
        },[]);

        //currying -> função que retorna outra função
        const handleInputChange = (index) => (e) => {
            const newValues = boxes;
            newValues[index] = e.target.value;
            setBoxes(newValues);
        };

        function handleSelectTemplate(templates){
            setSelectedTemplate(templates)
            setBoxes([]);
        }


        async function handleSubmit(e){
            e.preventDefault();

            const params = qs.stringify({
                    template_id: selectedTemplate.id,
                    username: 'alvesronald',
                    password: 'meme270601',
                    boxes:boxes.map(text => ({ text })),
                 })

                 const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`);
                 const {data: { url }}  = await resp.json();
                 setGenerateMeme(url)
        }  

        function handleReset(){
            setSelectedTemplate(null);
            setBoxes([]);
            setGenerateMeme(null)
        }

    return (
        <Wrapper>
            <img src={logo} alt=""/>
            <Card>
                {generatedMeme && (
                    <>
                        <img src={generatedMeme} alt="Generated Meme" />
                        <Button type="button" onClick={handleReset}>Criar outro meme</Button>                    

                    </>
                )}
             {!generatedMeme && (
                 <>
                       <h2>Selecione o template</h2>
                        <Template>
                        {
                            templates.map(template => (
                                <button 
                                    type="button"
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    className={template.id === selectedTemplate?.id ? 'selected' : ''}
                                >
                                    <img src={template.url} alt={template.name} />
                                </button>
                            ))
                        }                   
                        </Template>

                        {selectedTemplate && (
                            <>
                                <h2>Texto</h2>                
                                <Form onSubmit={handleSubmit}>
                                    {(new Array(selectedTemplate.box_count)).fill('').map((_,index) => (
                                        <input 
                                            key={String(Math.random())}
                                            placeholder={`Texto #${index + 1}`}
                                            onChange={handleInputChange(index)}
                                        />
                                    ))}                              

                                        <Button type="submit">MakeMyMeme</Button>                    
                                </Form>
                            </>
                        )}
                 </>
             )}
            </Card>
        </Wrapper>    
    )
    
}