package uni.mannheim.apdtld.mdm_view.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Serializable;
import java.io.Writer;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.PersistenceUnit;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.EmbeddableType;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.ManagedType;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transaction;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.opencsv.CSVReader;

import uni.mannheim.apdtld.mdm_model.persistence.Customer;
import uni.mannheim.apdtld.mdm_view.odata.JpaEntityManagerFactory;
import uni.mannheim.apdtld.mdm_view.odata.ODataJPAServiceFactory;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.Mapping;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.MappingArray;

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
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	
		Writer out = response.getWriter();
		
		StringBuffer jb = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = request.getReader();
			while ((line = reader.readLine()) != null)
				jb.append(line);
		} catch (Exception e) { /*report an error*/ }

		MappingArray mappingsArray = new GsonBuilder().create().fromJson(jb.toString(), MappingArray.class);
		HashMap<String, HashSet<Mapping>> mappings = mappingsArray.getMappingMap();
		
		EntityManagerFactory fac;
		try {
			fac = JpaEntityManagerFactory.getEntityManagerFactory("data_model");
			EntityManager em = fac.createEntityManager();
			
			CSVReader reader = new CSVReader(new FileReader(filePath + "Mappe1.csv"), ';');
			String[] nextLine;
			String[] header = reader.readNext();

			while ((nextLine = reader.readNext()) != null) {
				HashMap<String, Object> typeObjectMap = new HashMap<String, Object>();
				int column = 0;
				for(String attribute:nextLine) {
					HashSet<Mapping> attributeMappings = mappings.get(header[column]);
					if(attributeMappings==null) {
						column++;
						continue; //mapping for attribute in file was not specified
					}
					for(Mapping mapping:attributeMappings){
						String[] dbNameParticles = mapping.dbName.split("\\."); // table.attribute
						Object object;
						if(!typeObjectMap.containsKey(dbNameParticles[0])) {
							Class<?> prototype = Class.forName("uni.mannheim.apdtld.mdm_model.persistence." + dbNameParticles[0]);
							Constructor<?> ctor = prototype.getConstructor();
							object = ctor.newInstance();
							typeObjectMap.put(dbNameParticles[0], object);
						} else {
							object = typeObjectMap.get(dbNameParticles[0]);
						}
						
						Field f = object.getClass().getDeclaredField(dbNameParticles[1]);
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						f.set(object, attribute);
						f.setAccessible(acc);
					}
					column++;
				}
				
				for(Object object:typeObjectMap.values()) {
					EntityTransaction ext = em.getTransaction();
					ext.begin();
					em.persist(object);
					em.flush();
					ext.commit();
				}				
			}
			em.close();
			reader.close();
			
		} catch (Exception e) {
			e.printStackTrace();
			out.write(e.getMessage());
			// Please don't :)
		}
		out.write("{}");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		
		JsonObject json = new JsonObject();
		Writer out = response.getWriter();
		
		String filename = request.getParameter("file");
		this.parseFile(filePath + filename);
		
		if(!this.headerrowDetected) return;
		
		this.analyseDatabaseStructure();
				
		JsonArray jsonMappings = new JsonArray();
		for(ArrayList<String> column:sampleList) {
			
			String fileColumnHeader = column.get(0);
			for(Table table:this.tables) {
				String dbTableName = table.getName();
				HashMap<String, AttributeTupel> attributesAndTypes = table.getAttributeInfo();
				for(Entry<String, AttributeTupel> attributeAndType:attributesAndTypes.entrySet()) {
					if(StringUtils.getLevenshteinDistance(attributeAndType.getKey(), fileColumnHeader) < 3 && 
							this.attributeTypeMap.get(fileColumnHeader).equals(attributeAndType.getValue().type)) {
						 
						String attributeName = column.get(0);
						 
						JsonObject item = new JsonObject();
						item.addProperty("fName", attributeName);
						
						item.addProperty("fType", attributeTypeMap.get(attributeName));
						 
						String sample = "";
						for(int rowIndex=1; rowIndex<column.size(); rowIndex++) {
							sample += column.get(rowIndex) + ", ";
						}
						sample = this.shortenSample(sample);
						item.addProperty("fSample", sample.length());
						
						item.addProperty("dbName", dbTableName + "." + attributeAndType.getKey());
						item.addProperty("dbType", attributeAndType.getValue().type);
						item.addProperty("dbSample", this.shortenSample(attributeAndType.getValue().sample));
						 
						jsonMappings.add(item);
					}
				}
			}	 
		}
		
		JsonArray jsonAttributesDB = new JsonArray();
		for(Table table:this.tables) {
			for(Map.Entry<String, AttributeTupel> entry:table.getAttributeInfo().entrySet()) {
				JsonObject jsonAttribute = new JsonObject();
				jsonAttribute.addProperty("name", table.getName() + "." + entry.getKey());
				jsonAttribute.addProperty("type", entry.getValue().type);
				jsonAttribute.addProperty("sample", this.shortenSample(entry.getValue().sample));
				jsonAttributesDB.add(jsonAttribute);
			}
			
		}
		
		JsonArray jsonAttributesFile = new JsonArray();
		for(ArrayList<String> column:sampleList) {
			JsonObject jsonAttribute = new JsonObject();
			jsonAttribute.addProperty("name", column.get(0));
			jsonAttribute.addProperty("type", this.attributeTypeMap.get(column.get(0)));
			String sample = "";
			for(int rowIndex=1; rowIndex<column.size(); rowIndex++) {
				sample += column.get(rowIndex) + ", ";
			}
			sample = this.shortenSample(sample);
			jsonAttribute.addProperty("sample", sample);
			jsonAttributesFile.add(jsonAttribute);
		}
		
		json.add("mappings", jsonMappings);
		json.add("attributes_database", jsonAttributesDB);
		json.add("attributes_file", jsonAttributesFile);
		json.addProperty("filename", filename);
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
			//EntityManager em = fac.createEntityManager();
			Set<EntityType<?>> entities = fac.getMetamodel().getEntities();
			Iterator<EntityType<?>> it = entities.iterator();
			while(it.hasNext()) {
				EntityType<?> o = it.next();
				Table table = new Table(o.getName());
				for(Attribute<?,?> attr : o.getAttributes()) {
					String type = attr.getJavaType().getName();
					if(type.indexOf("String")>0) {
						type = "Text";
					} else if(type.indexOf("int")>=0 || type.indexOf("float")>=0 || type.indexOf("double")>=0) {
						type = "Number";
					} else if(type.equals("java.util.Calendar")) {
						type = "Date";
					} else {
						type = "ref";
					}
					
				
					/*CriteriaBuilder em = fac.getCriteriaBuilder();
					CriteriaQuery<Customer> cq = em.createQuery(Customer.class);
					Root<Customer> rootEntry = cq.from(Customer.class);
					CriteriaQuery<Customer> all = cq.select(rootEntry);
					TypedQuery<Customer> allQuery = em.createQuery(all);
					allQuery.getResultList();*/
					String sample = "";
					List<?> rows = fac.createEntityManager()
							.createQuery("Select t From " + o.getName() + " t")
							//.setMaxResults(10)
							.getResultList();

					for(Object row:rows) {
						Class<?> c = row.getClass();
						Field f = c.getDeclaredField(attr.getName());
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						sample += f.get(row) + "; ";
						f.setAccessible(acc);
					}
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type, sample);
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
	
	private String shortenSample(String sample) {
		if(sample.length()>15) {
			return sample.substring(0, 15) + "...";
		} else if(sample.length()>2){
			return sample.substring(0, sample.length()-3);
		} else {
			return "";
		}
	}

}
