export const Mobilevalidator=(mn)=>{
        const checker_=/[\sA-Z\\^+=-_)(!@#$%&*)?/|><.,:;{}['"~`\]]/gi
        const validmobileno=mn.match(checker_)
        if(mn)
        {
          if(validmobileno || mn.length!==10)
          {
            return true
        
          }
          else {
            return false
          }
        
        }
        else {
            // console.log(mn)
          return false
        }
    
}