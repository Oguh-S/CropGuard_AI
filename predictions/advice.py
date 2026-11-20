"""General, low-risk next steps for the model's supported labels."""


def _advice(summary, actions, source, source_name):
    return {
        "summary": summary,
        "actions": actions,
        "source": {"name": source_name, "url": source},
    }


_TOMATO_SPOTS = "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/yard-and-garden-problems/tomato-leaf-spot-diseases"
_CASSAVA = "https://www.iita.org/wp-content/uploads/2016/06/Disease_control_in_cassava_farms_IPM_field_guide_for_extension_agents-1.pdf"
_CASHEW = "https://ksacc.kerala.gov.in/cultivation_guide.html"
_MAIZE = "https://assets.accessagriculture.org/s3fs-public/FAO_FFS_guide_for_FAW_control.pdf"
_TOMATO_VIRUS = "https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/tomato-viruses"
_CORN_VIRUS = "https://www.accessagriculture.org/sites/default/files/2025-12/FiBL%20African%20Organic%20Agriculture%20-%20Maize.pdf"
_TOMATO_WILT = "https://apps.extension.umn.edu/garden/diagnose/plant/vegetable/tomato/leaveswilted.html"


ADVICE = {
    "Cashew___anthracnose": _advice("This may be a fungal leaf or shoot disease.", ["Remove badly affected fallen leaves and pruned material from the orchard.", "Keep the canopy open with careful pruning and avoid handling wet plants.", "Ask a local cashew extension officer to confirm the disease before choosing a treatment."], _CASHEW, "Kerala State Agency for the Expansion of Cashew Cultivation"),
    "Cashew___gumosis": _advice("Gum on cashew bark can have several causes and needs an in-person check.", ["Check the trunk and branches for wounds, borer holes, or cracked bark.", "Avoid injuring the trunk during weeding and remove only clearly dead branches with clean tools.", "Have a local cashew specialist inspect the tree before applying any product."], _CASHEW, "Kerala State Agency for the Expansion of Cashew Cultivation"),
    "Cashew___healthy": _advice("No disease signs were matched in this photo.", ["Continue checking new leaves and shoots during the growing season.", "Keep the orchard clean and maintain good airflow through the canopy."], _CASHEW, "Kerala State Agency for the Expansion of Cashew Cultivation"),
    "Cashew___leaf miner": _advice("The pattern may be consistent with leaf-mining insects, which feed inside the leaf.", ["Check several young leaves for winding tunnels or blisters and live larvae.", "Remove a small number of badly mined leaves and monitor whether damage is spreading.", "Seek local advice if many new leaves are affected; preserve beneficial insects."], "https://www.celkau.in/crops/cashcrops/cashew/leafminer.php", "Kerala Agricultural University"),
    "Cashew___red rust": _advice("The model may be detecting algal red rust; similar marks can have other causes.", ["Inspect more leaves and branches for raised orange or rust-colored patches.", "Prune for airflow and remove heavily affected fallen material.", "Ask a local cashew extension officer to confirm the cause and severity."], _CASHEW, "Kerala State Agency for the Expansion of Cashew Cultivation"),
    "Cassava___bacterial blight": _advice("Cassava leaf blight symptoms can spread with infected planting material and crop debris.", ["Use healthy, disease-free stem cuttings when planting; do not save cuttings from symptomatic plants.", "Remove badly affected plants and crop debris where practical.", "Get local confirmation and ask about locally recommended resistant varieties."], _CASSAVA, "IITA cassava disease-control field guide"),
    "Cassava___brown spot": _advice("Leaf spots can be influenced by disease pressure and growing conditions.", ["Remove heavily affected leaves and avoid moving wet foliage between plants.", "Use healthy planting cuttings and rotate fields where practical.", "Ask an extension officer to confirm the cause if spotting is spreading."], _CASSAVA, "IITA cassava disease-control field guide"),
    "Cassava___green mite": _advice("Check the undersides of young leaves and shoots for mites and fine webbing.", ["Inspect several plants, including the newest growth, to see how widely damage is spread.", "Protect natural enemies and avoid broad pesticide use without local advice.", "Ask an extension officer about locally suitable integrated pest management if damage is increasing."], _CASSAVA, "IITA cassava disease-control field guide"),
    "Cassava___healthy": _advice("No disease signs were matched in this photo.", ["Keep using healthy stem cuttings for new fields.", "Check young leaves regularly for mosaic, spots, or mite damage."], _CASSAVA, "IITA cassava disease-control field guide"),
    "Cassava___mosaic": _advice("Cassava mosaic is a viral disease; an infected plant cannot be cured.", ["Use clean, disease-free cuttings for new planting and avoid saving stems from symptomatic plants.", "Ask locally about mosaic-resistant varieties suited to your area.", "Get local advice on removing symptomatic plants and managing whiteflies."], "https://propas.iita.org/en/solutions/disease-resistant-cassava-varieties/51/details/", "IITA cassava resistant-variety guidance"),
    "Maize___fall armyworm": _advice("Look inside the maize whorl for caterpillars, fresh feeding, and frass before acting.", ["Scout the field regularly and check multiple areas, not only the most damaged plants.", "Record how many plants have live larvae and fresh damage; small larvae are easier to manage.", "Use locally recommended integrated pest management and only consider a registered product after local advice."], _MAIZE, "FAO farmer field school guide to fall armyworm"),
    "Maize___grasshoper": _advice("The photo may show chewing insect damage; confirm that grasshoppers are present.", ["Inspect several plants and field edges for live grasshoppers and fresh feeding.", "Monitor whether damage is increasing, especially on young plants.", "Consult local extension before pest control, particularly near pollinators or water."], "https://extension.okstate.edu/fact-sheets/management-of-insect-and-mite-pests-in-corn", "Oklahoma State University Extension"),
    "Maize___healthy": _advice("No disease signs were matched in this photo.", ["Continue scouting the crop as it grows, especially after warm or wet periods.", "Use healthy seed and locally recommended varieties."], _MAIZE, "FAO farmer field school guide to fall armyworm"),
    "Maize___leaf beetle": _advice("Check the plant for live beetles or larvae; leaf damage alone does not confirm the pest.", ["Scout several parts of the field and note whether fresh feeding is spreading.", "Protect beneficial insects and avoid spraying without confirming the pest and need.", "Ask local extension for crop-stage-specific advice if damage is widespread."], "https://extension.okstate.edu/fact-sheets/management-of-insect-and-mite-pests-in-corn", "Oklahoma State University Extension"),
    "Maize___leaf blight": _advice("Leaf blights are difficult to distinguish from a photo alone.", ["Remove volunteer maize and manage crop residue where practical.", "For the next planting, ask locally about resistant varieties and crop rotation.", "Have a local extension officer confirm the disease if lesions are spreading."], "https://extension.umn.edu/agriculture/crop-production/corn/gray-leaf-spot-on-corn", "University of Minnesota Extension"),
    "Maize___leaf spot": _advice("Leaf spots can have several causes, so confirm before treating.", ["Check whether spots are spreading on newer leaves and across the field.", "Manage crop residue and rotate crops where practical.", "Ask a local extension officer to identify the disease and suitable resistant varieties."], "https://extension.umn.edu/agriculture/crop-production/corn/gray-leaf-spot-on-corn", "University of Minnesota Extension"),
    "Maize___streak virus": _advice("Maize streak is a virus and cannot be cured after infection.", ["Use maize-streak-resistant seed suited to your area for future planting.", "Ask local extension about removing severely affected plants and planting time.", "Monitor leafhoppers and manage grassy weeds around fields where advised locally."], _CORN_VIRUS, "African Organic Agriculture training manual"),
    "Tomato___healthy": _advice("No disease signs were matched in this photo.", ["Keep checking new growth and the undersides of leaves.", "Water at soil level when possible and maintain airflow around plants."], _TOMATO_SPOTS, "University of Minnesota Extension"),
    "Tomato___leaf blight": _advice("Several tomato blights look alike; confirm the cause before treatment.", ["Remove affected lower leaves and fallen plant debris; clean tools after use.", "Water at soil level, use mulch to limit soil splash, and give plants room for airflow.", "Ask local extension to confirm the disease, especially if it is spreading quickly."], _TOMATO_SPOTS, "University of Minnesota Extension"),
    "Tomato___leaf curl": _advice("Leaf curl can come from viruses, insects, heat, water stress, or herbicide exposure.", ["Check leaf undersides for whiteflies and review recent heat, watering, or nearby herbicide use.", "If virus is suspected, seek confirmation; do not move cuttings from affected plants.", "Ask local extension whether removal or vector management is appropriate."], _TOMATO_VIRUS, "University of Minnesota Extension"),
    "Tomato___septoria leaf spot": _advice("Septoria-like spots often spread from lower leaves, but photo identification is not certain.", ["Remove spotted lower leaves and fallen debris; avoid working among wet plants.", "Water at soil level, mulch to reduce soil splash, and improve spacing and airflow.", "Rotate away from tomatoes where practical and ask local extension if symptoms continue."], _TOMATO_SPOTS, "University of Minnesota Extension"),
    "Tomato___verticulium wilt": _advice("Wilting can have several causes; a photo cannot confirm Verticillium wilt.", ["Check soil moisture and inspect whether wilting starts on one side or lower leaves.", "Ask an extension officer or plant clinic to confirm before removing plants.", "For future planting, ask locally about resistant varieties and avoid moving contaminated soil."], _TOMATO_WILT, "University of Minnesota Extension"),
}


def advice_for(label):
    """Return advice keyed by exact model label, with a safe fallback."""
    return ADVICE.get(label, _advice(
        "This result needs local confirmation before choosing a treatment.",
        ["Inspect several plants for the same signs and note whether symptoms are spreading.", "Contact a local agricultural extension officer for diagnosis and crop-specific advice."],
        _CASSAVA,
        "IITA cassava disease-control field guide",
    ))
