// const employeeConfig = require("../../../model-config/employeeConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const {preloadAssociations}=require('../../../sequelize/association');
const { v4 } = require("uuid");
const customerConfig = require("../../../model-config/customerConfig");
const fs = require('fs/promises');
function generateUniqueFileName(originalFileName) {

  const timestamp = Date.now();
  const uniqueIdentifier = Math.random().toString(36).substring(7);
  const fileExtension = originalFileName.split('.').pop(); // Get the file extension
  return `${timestamp}-${uniqueIdentifier}.${fileExtension}`;}
const uploadPanCard = async (file) => {


  try {
      // Check if image file is included
      if (file) {
        let dynamicDirectory;
        dynamicDirectory = 'D:/insurance_final_project/uploadimages/customer/customerpancard';
        const uniqueFileName = generateUniqueFileName(file.name);
        
        await fs.mkdir(dynamicDirectory, { recursive: true });
        const finalFileLocation = `${dynamicDirectory}/${uniqueFileName}`;
        await fs.writeFile(finalFileLocation, file.data);
        if (file.mimetype != 'application/pdf') {
        throw  new Error('Invalid file type. Only PDF files are allowed.');

      } 
          // Access the file location and name
          const fileLocation = finalFileLocation; // File path
          const fileName = uniqueFileName; // File name

          return { "fileLocation": fileLocation, "fileName": fileName };
      } else {
          return { error: 'PDF file is required.' };
      }
  } catch (error) {
      throw error;
  }}
const uploadAddharCard = async (file) => {


  try {
    // Check if image file is included
    if (file) {
      let dynamicDirectory;
      dynamicDirectory = 'D:/insurance_final_project/uploadimages/customer/customerpancard';
      const uniqueFileName = generateUniqueFileName(file.name);
      
      await fs.mkdir(dynamicDirectory, { recursive: true });
      const finalFileLocation = `${dynamicDirectory}/${uniqueFileName}`;
      await fs.writeFile(finalFileLocation, file.data);
      if (file.mimetype != 'application/pdf') {
      throw  new Error('Invalid file type. Only PDF files are allowed.');

    } 
        // Access the file location and name
        const fileLocation = finalFileLocation; // File path
        const fileName = uniqueFileName; // File name

        return { "fileLocation": fileLocation, "fileName": fileName };
    } else {
        return { error: 'PDF file is required.' };
    }
} catch (error) {
    throw error;
}}
const uploadImage = async (file) => {


  try {
    // Check if image file is included
    if (file) {
      let dynamicDirectory;
      dynamicDirectory = 'D:/insurance_final_project/uploadimages/customer/customerpancard';
      const uniqueFileName = generateUniqueFileName(file.name);
      
      await fs.mkdir(dynamicDirectory, { recursive: true });
      const finalFileLocation = `${dynamicDirectory}/${uniqueFileName}`;
      await fs.writeFile(finalFileLocation, file.data);
      if (file.mimetype != 'image/jpeg') {
      throw  new Error('Invalid file type. Only PDF files are allowed.');

    } 
        // Access the file location and name
        const fileLocation = finalFileLocation; // File path
        const fileName = uniqueFileName; // File name

        return { "fileLocation": fileLocation, "fileName": fileName };
    } else {
        return { error: 'PDF file is required.' };
    }
} catch (error) {
    throw error;
}
};
class CustomerService{
    // #associatiomMap = {
    //     account: {
    //       model: accountConfig.model,
    //       as: "account"
    //     },
    //   };
    constructor(){

    }
async createCustomer(settingsConfig, body,file) {
  const t = await startTransaction();
  try {
    const logger = settingsConfig.logger;
    logger.info(`[CustomerService] : Inside createCustomer`);
    const hashpassword = await bcrypt.hash(body.password, 12);
    body.id = v4();
    body.username="Cust"+body.username
    body.password = hashpassword;
    

    const fileResult = await uploadImage(file.image);
    const fileResultForAddharCard = await uploadAddharCard(file.addharcard);
    const fileResultForPanCard = await uploadPanCard(file.pancard);
    body.customerAddharUrl=fileResultForAddharCard.fileLocation
    body.customerPanUrl=fileResultForPanCard.fileLocation
    body.status=false
    body.customerImgUrl =fileResult.fileLocation
    const data = await customerConfig.model.create(body, { transaction: t });
    await t.commit();
    return data;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

      async getCustomerByUsername(settingsConfig, username) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[CustomerService] : Inside getCustomerByUsername`);
          const data = await customerConfig.model.findAll({
            where: { username: username },
            paranoid:false,
            transaction: t,
          });
          await t.commit();
          return data;
        } catch (error) {
          await t.rollback();
          throw error;
        }
      }
    
    async deleteCustomer(settingsConfig,customerId){
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[customerService] : Inside deleteCustomer`);
       
      const data= await customerConfig.model.destroy({where:{id:customerId}})
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getAllCustomer(settingsConfig,queryParams){
        const t= await startTransaction() 
        try {
            const selectArray={
                id:customerConfig.fieldMapping.id,
                customerName:customerConfig.fieldMapping.customerName,
                dob:customerConfig.fieldMapping.dob,
                email:customerConfig.fieldMapping.email,
                // role:customerConfig.fieldMapping.role,
                state:customerConfig.fieldMapping.state,
                city:customerConfig.fieldMapping.city,
                pincode:customerConfig.fieldMapping.pincode,
                mobileno:customerConfig.fieldMapping.mobileno,
                nominee:customerConfig.fieldMapping.nominee,
                nomineeRelation:customerConfig.fieldMapping.nomineeRelation,
                address:customerConfig.fieldMapping.address
                // username:customerConfig.fieldMapping.username
             
                
            }
            const attributeToReturn=Object.values(selectArray)
            // const includeQuery = queryParams.include || [];


            // let association = [];
            // if (queryParams.include) {
            //   delete queryParams.include;
            // }
            // if (includeQuery) {
            //   association = this.createAssociation(includeQuery);
            //   console.log("UserService",association);
            // }
      
        const logger = settingsConfig.logger;
        logger.info(`[Customer_SERVICE] : Inside getAllCustomer`);
        const data=await customerConfig.model.findAndCountAll({ transaction: t,
            ...parseFilterQueries(queryParams, customerConfig.filter),
            attributes: attributeToReturn,
            ...parseLimitAndOffset(queryParams)
            //  ...preloadAssociations(association),  
        
        
        })
       if(data==null)
{
   throw new Error("Record Does Not Exists")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getCustomerById(settingsConfig,customerId,queryParams){
        const t= await startTransaction() 
        try {
            const attributeToReturn={
              id:customerConfig.fieldMapping.id,
                customerName:customerConfig.fieldMapping.customerName,
                dob:customerConfig.fieldMapping.dob,
                email:customerConfig.fieldMapping.email,
                role:customerConfig.fieldMapping.role,
                state:customerConfig.fieldMapping.state,
                city:customerConfig.fieldMapping.city,
                pincode:customerConfig.fieldMapping.pincode,
                mobileno:customerConfig.fieldMapping.mobileno,
                nominee:customerConfig.fieldMapping.nominee,
                nomineeRelation:customerConfig.fieldMapping.nomineeRelation,
                username:customerConfig.fieldMapping.username,
                agentId:customerConfig.fieldMapping.agentId,
                address:customerConfig.fieldMapping.address
                
            }
            // const attributeToReturn=Object.values(selectArray)
            let selectArray = parseSelectFields(queryParams, attributeToReturn);

            if (!selectArray) {
              selectArray = Object.values(attributeToReturn);
            }
        const logger = settingsConfig.logger;
        logger.info(`[Customer_SERVICE] : Inside getCustomerById`);
        const data = await customerConfig.model.findOne({
            where: { id: customerId },
            attributes: selectArray,
            transaction: t,
            
          });
if(data==null)
        {
   throw new Error("User Does Not Exists With Given Id")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }






async updateCustomer(settingsConfig, custId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Customer_SERVICE] : Inside updateCustomer`);
      let custToBeUpdate = await customerConfig.model.update(body, {
        where: { id: custId },
        transaction: t,
      });
   
      t.commit();

      return custToBeUpdate;
   
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }


// async login(settingsConfig, bodyElements,queryParams) {
//   const t = await startTransaction();
//   try {
//     const { username, password,role } = bodyElements;

//     const arrtibutesToReturn = {
//       username:employeeConfig.fieldMapping.username,
//       password: employeeConfig.fieldMapping.password,
//       id: employeeConfig.fieldMapping.id,
//       employeeName: employeeConfig.fieldMapping.employeeName,
//       email: employeeConfig.fieldMapping.email,
//       isAdmin: employeeConfig.fieldMapping.isAdmin
//     };
 

//     const selectArray = Object.values(arrtibutesToReturn);
//     const passwordObj = await employeeConfig.model.findOne( {
//         ...parseFilterQueries(queryParams,employeeConfig.filter,{[employeeConfig.fieldMapping.username]:username}),t
//     });
    
//     const result = bcrypt.compare(password, await passwordObj.password);
//     console.log(await passwordObj)
   
//     if (!(await result)) {

//       throw new Error("Invalid Password");
//     }
//     if (await result) {
//       const payload = {
//         id: passwordObj.id,
//         username: passwordObj.username,
//         isAdmin: passwordObj.isAdmin,
//       };

//       const token = tokencreation(payload);
//       return [token,passwordObj];
//     }
//   } catch (error) {
//     throw error;
//   }
// }


}

const customerService=new CustomerService()
module.exports=customerService