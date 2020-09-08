# Example of importing a media file to MC | AM


### Introduction
This example shows how you can import media files to Avid MediaCentral | Asset Management (MAM) using the Avid Media Suite API (CTMS).

To import files using CTMS API the ma:file-check-in call is used. It starts the SWoDL script, which generates a BPMN process and then starts MAM_IMPORT_FILE process. The example relies on the default out of the box configuration, please be aware that the script can be customized for production environments to significantly change its behavior.

Note the default MAM_IMPORT_FILE process script might work for your needs but may require Avid professional services assistance to be modified for the exact customer needs e.g. the ability to add proxy media to an existing hires asset is limited. In certain cases best results can be achieved using the orchestration API. http://developer.avid.com/ctms/api/resources.html#_orchestration

Please start with CTMS Registry to get the ma:file-check-in link as an entry point to the interface and then follow links provided in responses. To generate body of the ma:file-check-in call please follow structure of the call that you can find bellow in the "Structure of the import call" section.

Note the file import path must be accessible by the MC|AM instance directly, which means using file shares already mounted on the server.

### Before using this example

1. Requirements:
	
    Any library to work with REST. This example uses "node-fetch" module. Link to module documentation: https://www.npmjs.com/package/node-fetch. 
    To use module add it to the package.json file:
		
		"node-fetch": "^2.6.0"
	  
2. Fill in the variables with your values:
    
	Variables for authorization:
	
    ```
       const client_id = 'your_client_id';
	   const client_sercet = 'your_secret_id';
	   const upstream = 'YOUR_HOST_IP';
	   const details = {
            'grant_type' : 'password', 
			'username' : 'username',
			'password' : 'password',
		};
	```
	

### Structure of the import call

You can import file using POST.
Request's body specification:



| Property | Description |
| ------ | ------ |
| file | Full path and name of the file. The file must be stored in a location that can be accessed by the AM system. Typically, this is a UNC path. |
| assetId | (Optional) The ID of an existing asset. If given, the file is imported to that asset. |
| assetType | (Optional) The type of the asset. The value is only used of assetId is not given. The asset type corresponds to the object class in AM. Can be:  asset.FILE, sequence.EDL, asset.SEASON, asset.VIDEO, asset.IMAGE, etc. |
| usage | (Optional) The intended usage of the file. The value can be one of: Browse, Thumb, Edit, Distr, Preserve, Aux, Any. If not given, the system determines the usage automatically. |
| fileType | (Optional) File type. Can be one of:	Video, Audio, Image, ImageSeq, Doc, Text, Fset, File .If not given, the file is imported as additional file without any special handling. |
| carrier | (Optional) Essence carrier that will receive the file. If not given, the system determines a carrier automatically. |
| params | (Optional) A JSON object with additional properties for the file import. The possible values depend on the AM version and on the other properties. |


Link to documentation: http://developer.avid.com/ctms/api/rs_ma/rs_ma_file-check-in.html