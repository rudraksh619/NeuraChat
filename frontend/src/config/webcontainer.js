import { WebContainer } from '@webcontainer/api';
  

let WebContainerInstance = null;


 export const getwebcontainer = () =>{

    if(WebContainerInstance === null){
        WebContainerInstance = new WebContainer();
    }

    return WebContainerInstance;

}