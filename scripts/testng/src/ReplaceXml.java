import java.io.FileWriter;
import java.io.IOException;
import java.util.Iterator;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;



public class ReplaceXml {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Document d=getXml(args[0]);
		Element root=d.getRootElement();
		treeWalk(root);
		writeXML(d,args[1]);
	}
	
	public static void treeWalk(Element element) {
		for (Iterator<Element> iterator = element.elements().iterator(); iterator.hasNext();) {
			Element e=iterator.next();
			//System.out.println(e.toString());
			if(e.attribute("test-instance-name")!=null){
				e.attribute("name").setValue( e.attribute("test-instance-name").getValue());
        		//System.out.println("replaced***: "+e.toString());
			}
            treeWalk(e);
		}
	}
	
	public static Document getXml(String path){
		SAXReader saxReader = new SAXReader();
		saxReader.setIgnoreComments(false);
		saxReader.setIncludeExternalDTDDeclarations(true);
		saxReader.setIncludeInternalDTDDeclarations(true);
		Document plistDocument = null;
		try {
			plistDocument = saxReader.read(path);
		} catch (DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return plistDocument;
	}

	
	
	protected static void writeXML(Document doc,String path) {
		XMLWriter writer = null;
		try {
			OutputFormat format = OutputFormat.createPrettyPrint();
			writer = new XMLWriter(new FileWriter(path), format);
			writer.write(doc);
			writer.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {
			try {
				if (writer != null){
					writer.close();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
