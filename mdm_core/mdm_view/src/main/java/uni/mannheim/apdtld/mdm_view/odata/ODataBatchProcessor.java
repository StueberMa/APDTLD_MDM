package uni.mannheim.apdtld.mdm_view.odata;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.olingo.odata2.api.batch.BatchHandler;
import org.apache.olingo.odata2.api.batch.BatchRequestPart;
import org.apache.olingo.odata2.api.batch.BatchResponsePart;
import org.apache.olingo.odata2.api.commons.HttpStatusCodes;
import org.apache.olingo.odata2.api.ep.EntityProvider;
import org.apache.olingo.odata2.api.ep.EntityProviderBatchProperties;
import org.apache.olingo.odata2.api.exception.ODataException;
import org.apache.olingo.odata2.api.processor.ODataRequest;
import org.apache.olingo.odata2.api.processor.ODataRequest.ODataRequestBuilder;
import org.apache.olingo.odata2.api.processor.ODataResponse;
import org.apache.olingo.odata2.api.uri.PathInfo;
import org.apache.olingo.odata2.core.ODataRequestImpl;
import org.apache.olingo.odata2.jpa.processor.api.ODataJPAContext;
import org.apache.olingo.odata2.jpa.processor.core.ODataJPAProcessorDefault;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * OData Batch Processor implementation.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 19.10.2015
 */
public class ODataBatchProcessor extends ODataJPAProcessorDefault {

	/**
	 * Constructor
	 * 
	 * @param oDataJPAContext
	 */
	public ODataBatchProcessor(ODataJPAContext oDataJPAContext) {
		super(oDataJPAContext);
	}

	/**
	 * Method to executes a OData batch request
	 * 
	 * @param handler
	 * @param contentType
	 * @param content
	 * @return ODataResponse
	 * @throws ODataException
	 */
	@Override
	public ODataResponse executeBatch(BatchHandler handler, String contentType, InputStream content)
			throws ODataException {

		// declaration
		List<BatchResponsePart> batchResponseParts = null;
		List<BatchRequestPart> batchRequestParts = null;
		ODataResponse batchResponse = null;
		PathInfo pathInfo = null;
		EntityProviderBatchProperties batchProperties = null;

		// initialization
		batchResponseParts = new ArrayList<BatchResponsePart>();

		// process batch
		pathInfo = getContext().getPathInfo();
		batchProperties = EntityProviderBatchProperties.init().pathInfo(pathInfo).build();
		batchRequestParts = EntityProvider.parseBatchRequest(contentType, content, batchProperties);

		for (BatchRequestPart batchRequestPart : batchRequestParts) {
			BatchResponsePart processedBatchPart = handler.handleBatchPart(batchRequestPart);
			batchResponseParts.add(processedBatchPart);
		}

		// response
		batchResponse = EntityProvider.writeBatchResponse(batchResponseParts);

		return batchResponse;
	}

	/**
	 * Method to executes a Change Set and provide batch response.
	 * 
	 * @param handler
	 * @param requests
	 * @return BatchResponsePart
	 * @throws ODataException
	 */
	@Override
	public BatchResponsePart executeChangeSet(BatchHandler handler, List<ODataRequest> requests) throws ODataException {

		// declaration
		List<ODataResponse> responses = null;
		List<ODataResponse> errorResponses = null;
		ODataResponse response = null;	

		// initialization
		responses = new ArrayList<ODataResponse>();

		// process request
		for (ODataRequest request : requests) {
			
			request = resolveAssociations(request);
			response = handler.handleRequest(request);

			// handle bad request
			if (response.getStatus().getStatusCode() >= HttpStatusCodes.BAD_REQUEST.getStatusCode()) {
				errorResponses = new ArrayList<ODataResponse>(1);
				errorResponses.add(response);
				return BatchResponsePart.responses(errorResponses).changeSet(false).build();
			}

			responses.add(response);
		}

		return BatchResponsePart.responses(responses).changeSet(true).build();
	}
	
	/**
	 * Method to resolveAssociations
	 * 
	 * @param request
	 */
	private ODataRequest resolveAssociations(ODataRequest request) {
		
		// declaration
		BufferedReader br = null;
		InputStream is = null;
		JsonParser parser = null;
		JsonObject body = null;
		JsonObject metadata = null;
		JsonObject details = null;
		String bodyTxt = ""; 
		
		// initialization
		parser = new JsonParser();
		is = request.getBody();
		br = new BufferedReader(new InputStreamReader(is));
		
		try {
			bodyTxt = br.readLine();
			br.close();
			is.reset();
		} catch (IOException e) {
			// do nothing
		}
		
		body = (JsonObject) parser.parse(bodyTxt);
		metadata = body.getAsJsonObject("__metadata");
		
		// ensure associations available
		if(!metadata.get("type").getAsString().equals("data_model.Lead"))
			return request;
		
		// Customer
		if(body.get("CustomerId") != null) {
			details = new JsonObject();
			details.add("Id", body.get("CustomerId"));
			body.add("CustomerDetails", details);
		}
		
		// Product
		if(body.get("ProductId") != null) {
			details = new JsonObject();
			details.add("Id", body.get("ProductId"));
			body.add("ProductDetails", details);
		}
		
		// Campaign
		if(body.get("CampaignId") != null) {
			details = new JsonObject();
			details.add("Id", body.get("CampaignId"));
			body.add("CampaignDetails", details);
		}
		
		// create new Request
		ODataRequestBuilder req = ODataRequestImpl.newBuilder();
		req.acceptableLanguages(request.getAcceptableLanguages());
		req.acceptHeaders(request.getAcceptHeaders());
		req.allQueryParameters(request.getAllQueryParameters());
		req.body(new ByteArrayInputStream(body.toString().getBytes(StandardCharsets.UTF_8)));
		req.contentType(request.getContentType());
		req.method(request.getMethod());
		req.pathInfo(request.getPathInfo());
		req.queryParameters(request.getQueryParameters());
		req.requestHeaders(request.getRequestHeaders());
		
		return req.build();
	}
}
