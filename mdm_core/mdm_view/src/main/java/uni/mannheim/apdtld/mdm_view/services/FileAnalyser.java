package uni.mannheim.apdtld.mdm_view.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Writer;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
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
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.EmbeddableType;
import javax.persistence.metamodel.EntityType;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import uni.mannheim.apdtld.mdm_view.odata.JpaEntityManagerFactory;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.Mapping;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.MappingArray;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.opencsv.CSVReader;

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
			
			CSVReader reader = new CSVReader(new FileReader(filePath + request.getParameter("file")), ';');
			String[] nextLine;
			String[] header = reader.readNext();

			while ((nextLine = reader.readNext()) != null) {
				HashMap<String, Object> typeEntityMap = new HashMap<String, Object>();
				HashMap<String, Object> typeEmebeddableMap = new HashMap<String, Object>();
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
						String className = null;
						String parentName = null;
						String attributeName = null;
						HashMap<String, Object> store = null;
						if(dbNameParticles.length==2) {
							className = dbNameParticles[0];
							attributeName = dbNameParticles[1];
							store = typeEntityMap;
						} else if(dbNameParticles.length==3) {
							parentName = dbNameParticles[0];
							className = dbNameParticles[1];
							attributeName = dbNameParticles[2];
							store = typeEmebeddableMap;
						}
						if(!store.containsKey(className)) {
							Class<?> prototype = Class.forName("uni.mannheim.apdtld.mdm_model.persistence." + className);
							Constructor<?> ctor = prototype.getConstructor();
							object = ctor.newInstance();
							store.put(className, object);
							if(dbNameParticles.length==3) {
								Object parentObject = null;
								if(typeEntityMap.containsKey(parentName)) {
									parentObject = typeEntityMap.get(parentName);
								}
								if(parentObject==null) {
									Class<?> parentPrototype = Class.forName("uni.mannheim.apdtld.mdm_model.persistence." + parentName);
									Constructor<?> parentCtor = parentPrototype.getConstructor();
									parentObject = parentCtor.newInstance();
									typeEntityMap.put(parentName, parentObject);
								}
								
								char c[] = className.toCharArray();
								c[0] = Character.toLowerCase(c[0]);
								Field f = parentObject.getClass().getDeclaredField(new String(c));
								boolean acc = f.isAccessible();
								f.setAccessible(true);
								f.set(parentObject, object);
								f.setAccessible(acc);
							}
						} else {
							object = store.get(className);
						}
						
						Object attributeObject = null;
						if(mapping.fType.equals("Text")) {
							attributeObject = attribute;
						} else if(mapping.fType.equals("Number")) {
							attributeObject = Double.parseDouble(attribute);
						} else if(mapping.fType.equals("Date")) {
							Calendar cal = new GregorianCalendar();
							cal.setTime((new SimpleDateFormat("dd.MM.yyyy")).parse(attribute));
							attributeObject = cal;
						}
						Field f = object.getClass().getDeclaredField(attributeName);
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						try {
							f.set(object, attributeObject);
						} catch(Exception ex) {
							f.set(object, ((Number)attributeObject).intValue());
						}
						f.setAccessible(acc);
					}
					column++;
				}
				
				for(Object object:typeEntityMap.values()) {
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
					String name = attributeAndType.getKey();
					String[] parts = name.split("\\.");
					name = parts[parts.length-1];
					if(StringUtils.getLevenshteinDistance(name, fileColumnHeader) < 3 && 
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
						item.addProperty("fSample", sample);
						
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
		
		HashMap<String, Table> embedables = new HashMap<>();
		
		try {
			EntityManagerFactory fac = JpaEntityManagerFactory.getEntityManagerFactory("data_model");
			
			Set<EmbeddableType<?>> embeddables = fac.getMetamodel().getEmbeddables();
			Iterator<EmbeddableType<?>> it2 = embeddables.iterator();
			while(it2.hasNext()) {
				EmbeddableType<?> o = it2.next();
				String[] fullyQualifiedNameParts = o.getJavaType().getName().split("\\.");
				String name = fullyQualifiedNameParts[fullyQualifiedNameParts.length-1];
				Table table = new Table(name);
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
					
					String sample = "";
					/*List<?> rows = fac.createEntityManager()
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
					}*/
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type, sample);
					}
				}
				embedables.put(name, table);
			}
			
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
						String[] fullyQualifiedNameParts = type.split("\\.");
						String name = fullyQualifiedNameParts[fullyQualifiedNameParts.length-1];
						if(embedables.containsKey(name)) {
							Table embeddedTable = embedables.get(name);
							for(AttributeTupel attribute:embeddedTable.getAttributeInfo().values()) {
								table.addAttribute(name + "." + attribute.name, attribute.type, attribute.sample);
							}
						}
						type = "ref";
					}

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
						if(f.get(row) instanceof GregorianCalendar) {
							Calendar cal = (GregorianCalendar)f.get(row);
							sample += new SimpleDateFormat("dd.MM.yyyy").format(cal.getTime()) + "; ";
						} else {
							sample += f.get(row) + "; ";
						}
						f.setAccessible(acc);
					}
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type, sample);
					}
				}
				this.tables.add(table);
			}
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
			(new SimpleDateFormat("dd.MM.yyyy")).parse(str);
		} catch(ParseException pe) {
			return false;
		}
		return true;
	}
	
	private String shortenSample(String sample) {
		if(sample.length()>15) {
			return sample.substring(0, 15) + "...";
		} else if(sample.length()>2){
			return sample;
		} else {
			return "";
		}
	}
}
