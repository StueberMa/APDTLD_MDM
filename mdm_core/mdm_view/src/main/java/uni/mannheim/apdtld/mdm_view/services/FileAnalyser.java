package uni.mannheim.apdtld.mdm_view.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.naming.NamingException;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceUnit;
import javax.persistence.Query;
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.EmbeddableType;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.ManagedType;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.opencsv.CSVReader;

import uni.mannheim.apdtld.mdm_view.odata.JpaEntityManagerFactory;
import uni.mannheim.apdtld.mdm_view.odata.ODataJPAServiceFactory;

public class FileAnalyser extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String filePath;
	private ArrayList<ArrayList<String>> sampleList = null;
	private HashMap<String, String> attributeTypeMap = null;
	private boolean headerrowDetected = false;
	private Set<Table> tables = null;
	
	public void init() {
		// Get the file location where it would be stored.
		filePath = getServletContext().getInitParameter("file-upload");
		new File(filePath).mkdirs();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		
		JsonObject json = new JsonObject();
		Writer out = response.getWriter();
		
		this.parseFile(filePath + request.getParameter("file"));
		
		if(!this.headerrowDetected) return;
		
		this.analyseDatabaseStructure();
				
		JsonObject tableCategory = null;
		HashMap<String, JsonObject> tableMap = new HashMap<String, JsonObject>();
		for(ArrayList<String> column:sampleList) {
			
			String fileColumnHeader = column.get(0);
			for(Table table:this.tables) {
				//String dbTableName = table.getName();
				HashMap<String, String> attributesAndTypes = table.getAttributeNamesAndTypes();
				for(Entry<String, String> attributeAndType:attributesAndTypes.entrySet()) {
					if(StringUtils.getLevenshteinDistance(attributeAndType.getKey(), fileColumnHeader) < 3 && 
							this.attributeTypeMap.get(fileColumnHeader).equals(attributeAndType.getValue())) {
						if(!tableMap.containsKey(table.getName())) {
							 tableCategory = new JsonObject();
							 tableCategory.add("items", new JsonArray());
							 tableMap.put(table.getName(), tableCategory);
						 }
						 
						
						 String attributeName = column.get(0);
						 JsonArray items = tableCategory.getAsJsonArray("items");
						 JsonObject item = new JsonObject();
						 item.addProperty("fName", attributeName);
						 
						 item.addProperty("fType", attributeTypeMap.get(attributeName));
						 
						 String sample = "";
						 for(int rowIndex=1; rowIndex<column.size(); rowIndex++) {
							 sample += column.get(rowIndex) + ", ";
						 }
						 item.addProperty("fSample", sample.substring(0, sample.length()-2));
						 
						 item.addProperty("dbName", attributeAndType.getKey());
						 item.addProperty("dbType", attributeAndType.getValue());
						 item.addProperty("dbSample", "");
						 
						 items.add(item);
						
					}
				}
			}	 
		}
		
		for(Map.Entry<String, JsonObject> entry:tableMap.entrySet()) {
			json.add(entry.getKey(), entry.getValue());
		}
		
		out.write(json.toString());
		
	}
	
	private void parseFile(String filePath) throws IOException {
		CSVReader reader = new CSVReader(new FileReader(filePath), ';');
		String[] nextLine;
		this.sampleList = new ArrayList<ArrayList<String>>();
		int rowIndex = 0;
		while ((nextLine = reader.readNext()) != null && rowIndex < 10) {
			for(int columnIndex = 0; columnIndex < nextLine.length; columnIndex++) {
				if(sampleList.size() <= columnIndex) {
					sampleList.add(new ArrayList<String>());
				}
				sampleList.get(columnIndex).add(nextLine[columnIndex]);
			}
			rowIndex++;
		}
		reader.close();
		
		int headerIsTextAndBodyIsNotTextCount = 0;
		int headerIsNotTextCount = 0;
		
		attributeTypeMap = new HashMap<String, String>();
		for(ArrayList<String> column:sampleList) {
			String attributeName = column.get(0);
			boolean headerIsText = isText(attributeName);
			boolean bodyIsDate = true;
			boolean bodyIsNumber = true;
			for(rowIndex = 1; rowIndex < column.size(); rowIndex++) {
				String row = column.get(rowIndex);
				bodyIsDate &= this.isDate(row);
				bodyIsNumber &= this.isNumber(row);
			}
			
			boolean bodyIsText = bodyIsDate || bodyIsNumber;
			
			if(bodyIsDate) {
				attributeTypeMap.put(attributeName, "Date");
			} else if(bodyIsNumber) {
				attributeTypeMap.put(attributeName, "Number");
			} else {
				attributeTypeMap.put(attributeName, "Text");
			}
			
			if(headerIsText && !bodyIsText) {
				headerIsTextAndBodyIsNotTextCount++;
			}
			if(!headerIsText) {
				headerIsNotTextCount++;
			}
		}
		
		this.headerrowDetected = !(headerIsNotTextCount>0 || headerIsTextAndBodyIsNotTextCount==0);
	}
	
	private void analyseDatabaseStructure() {
		this.tables = new HashSet<Table>();
		
		try {
			EntityManagerFactory fac = JpaEntityManagerFactory.getEntityManagerFactory("data_model");
			Set<EntityType<?>> entities = fac.getMetamodel().getEntities();
			Iterator<EntityType<?>> it = entities.iterator();
			while(it.hasNext()) {
				EntityType<?> o = it.next();
				Table table = new Table(o.getName());
				for (Attribute<?,?> attr : o.getAttributes()) {
					String type = attr.getJavaType().getName();
					if(type.indexOf("String")>0) {
						type = "Text";
					} else if(type.indexOf("Integer")>0 || type.indexOf("Float")>0 || type.indexOf("Double")>0) {
						type = "Number";
					} else if(type.indexOf("Date")>0) {
						type = "Date";
					}
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type);
					}
				}
				this.tables.add(table);
			}
			
			
			/*Set<EmbeddableType<?>> embeddables = fac.getMetamodel().getEmbeddables();
			Iterator<EmbeddableType<?>> it2 = embeddables.iterator();
			while(it2.hasNext()) {
				EmbeddableType<?> o = it2.next();
				out.write(o.toString() + " + ");
			}
			
			Set<ManagedType<?>> manageds = fac.getMetamodel().getManagedTypes();
			Iterator<ManagedType<?>> it3 = manageds.iterator();
			while(it3.hasNext()) {
				ManagedType<?> o = it3.next();
				out.write(o.toString() + " + ");
			}*/
			//Object o = q.getSingleResult();
			//out.write(o.toString());
		} catch (NamingException e) {
		} catch (SQLException e) {
		} catch (Exception e) {
		}
	}
	
	private boolean isText(String str) {
		return !isNumber(str) && !isDate(str);
	}
	
	private boolean isNumber(String str) {
		try {  
			Double.parseDouble(str);  
		} catch(NumberFormatException nfe) {  
			return false;  
		}  
		return true;  
	}
	
	private boolean isDate(String str) {
		try {
			DateFormat.getInstance().parse(str);
		} catch(ParseException pe) {
			return false;
		}
		return true;
	}

}
