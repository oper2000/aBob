
import org.testng.Assert;
import org.testng.annotations.*;
// import org.testng.annotations.BeforeClass;
// import org.testng.annotations.AfterClass;
// import org.testng.annotations.Factory;
// import org.testng.annotations.Test;
import org.testng.ITest;
import org.testng.ITestResult;
import org.testng.internal.BaseTestMethod;
import org.testng.xml.XmlTest;
import java.lang.reflect.Field;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Properties;

/**
 * Created by amichaim on 05/10/2014
 */
public class SyncTestNG {

	private String deviceUrl/*="http://127.0.0.1:10081/"*/;
	private String testFile;
	private String currentTest;
// 	private String pathToTestCases;
// 	String pathToSyncDesktopClientExe;
// 	String pathToLocalSyncDesktopFolder;
// 	String pathToDataFiles;
	String PATH="/Users/bob/Documents/Developer/Quickbuild/";
	//private String rootFolder;
	boolean setupFlag=false;
	
	@BeforeClass
	public void setup() {
		if(setupFlag)
			return;
		Properties props = new Properties();
		try {
			props.load(new FileInputStream(PATH+"Test.properties"));
			deviceUrl = props.getProperty("deviceUrl");
			System.out.println("deviceUrl: "+deviceUrl);
			testFile = props.getProperty("testFile");
			System.out.println("testFile: "+testFile);
		} catch (IOException e) {
			System.out.println("Cannot load Test.properties. Exit.");
			System.exit(1);
		}
		setupFlag=true;

		//callSetupOnDevice();


	}
	
	
	@AfterClass
	public void teardown() {
		//callTeardownOnDevice();
	}

	//public class MyTestFactory {
		  @Factory
		  public Object[] createInstances(){
		  setup();
			  ArrayList<MyTest> tests = new ArrayList<MyTest>();
			    BufferedReader reader=null;
		        
		        String testData;
		        try {
		        	reader = new BufferedReader(new FileReader(testFile));
					while ((testData = reader.readLine()) != null) {
						if (testData != null && testData.contains(";") && !testData.startsWith("#")) {
							tests.add(new MyTest(testData.split(";")));
						}
				}
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		        finally{
		        	if (reader!=null)
						try {
							reader.close();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
		        }

		        return tests.toArray();
		  }
		//}
		
		    


	public class MyTest implements ITest{
		  private String[] _testData;
		  public MyTest(String[] testData) {
			  _testData = testData;
		  }
		  
	@Override
    public String getTestName() {
        return _testData[0];
    }

		  @Test
		  public void runTest(){
			  testCase(_testData[1],_testData[2]); 
		  }
		  
// 		      @AfterMethod(enabled = true)
//     public void SetResultTestName(ITestResult result) {
//    System.out.println("AfterMethod***");
// //        try {
// //          BaseTestMethod bm = (BaseTestMethod)result.getMethod();
// //          Field f = bm.getClass().getSuperclass().getDeclaredField("m_methodName");
// //          f.setAccessible(true);
// //          f.set(bm, currentTest);        
// //       }catch (Exception ex) {
// //          System.out.println("ex" + ex.getMessage());
// // }
// }
		  
	}


//	@Test(priority=1, description = "GetToken test")
//	public void testCase1() {testCase("GetToken/",SUCCESS);}
//	
//	@Test(priority=1, description = "GetToken with user&pass parameters")
//	public void testCase2() {testCase("GetToken/?scope=usernamePassword&userName=a&password=a",SUCCESS);}

//	@Test(priority=1, description = "GetRessourcesTest")
//	public void testCase3() {testCase("GetRessources/?scope=usernamePassword&userName=a&password=b",SUCCESS);}
	
	public void testCase(String urlParameters, String expectedRes) {

		//        String testScriptPath = pathToTestCases + File.separator + "testCase" + index + ".cmd";
		//        if ((new File(testScriptPath)).exists()) {
		//
		//            System.out.println("Starting script testCase" + index + "...");
		//
		//            callCmd("\"" +testScriptPath + "\" \"" + pathToLocalSyncDesktopFolder + "\" \"" + rootFolder + "\" \"" + pathToDataFiles + "\"", true);
		//
		//            System.out.println("test case script ended");
		//
		//            runSyncDesktop(secondsToWait);
		//
		//            String syncOutput = runSyncOnDevice();
		//
		//            String goldXmlPath = pathToTestCases + File.separator + "gold_testCase" + index + ".xml";
		//            String compResult = compareXmls(goldXmlPath, syncOutput);
		//String res = sendHttpResponse("?testName=GetToken");
		String res = sendHttpResponse(urlParameters);
		System.out.println("device reply is: "+res);
		Assert.assertEquals(res, expectedRes, res );

		System.out.println("End testCase " + urlParameters);
	}

	private String sendHttpResponse(String urlParameters) {
		URL url;
		HttpURLConnection connection = null;
		try {

			//Create connection
			url = new URL(deviceUrl+urlParameters);
			connection = (HttpURLConnection)url.openConnection();
			connection.setRequestMethod("GET");
			connection.setRequestProperty("Content-Type",
					"application/x-www-form-urlencoded");

			connection.setRequestProperty("Content-Length", "" +
					Integer.toString("".getBytes().length));
			connection.setRequestProperty("Content-Language", "en-US");

			connection.setUseCaches (false);
			connection.setDoInput(true);
			connection.setDoOutput(true);

			//Send request
			DataOutputStream wr = new DataOutputStream (
					connection.getOutputStream ());
			wr.writeBytes ("");
			wr.flush ();
			wr.close ();

			//Get Response
			InputStream is = connection.getInputStream();
			BufferedReader rd = new BufferedReader(new InputStreamReader(is));
			String line;
			StringBuffer response = new StringBuffer();
			while((line = rd.readLine()) != null) {
				response.append(line);
				response.append('\r');
			}
			rd.close();
			String res=response.toString();
			if(res.endsWith("\r"))
				res=res.substring(0,res.length()-1);
			return res;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {

			if(connection != null) {
				connection.disconnect();
			}
		}
	}

	//private static final String SUCCESS = "Success \r";
}
