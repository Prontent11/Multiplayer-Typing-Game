const wordStrings = `In the heart of a bustling city, where the hum of traffic and the chatter of people create a symphony of urban life, there exists a quiet coffee shop. Tucked away on a side street, it seems to be a haven of tranquility amidst the chaos. The aroma of freshly ground coffee beans wafts through the air, inviting passersby to step inside and escape the rush of the outside world.
The interior is warm and inviting, adorned with vintage posters and comfortable seating. The soft hum of conversation and the occasional clink of cups provide a soothing background soundtrack. Baristas behind the counter expertly craft each cup with precision, turning the act of making coffee into an art form.
As customers settle into plush armchairs, their faces illuminated by the warm glow of laptops, the coffee shop becomes a hub of creativity and contemplation. It's a space where ideas percolate along with the espresso, and the click-clack of keyboards creates a gentle rhythm.
In one corner, a book club gathers, their animated discussion punctuated by laughter and the sipping of lattes. In another, a solitary poet scribbles verses in a worn notebook, finding inspiration in the swirls of steam rising from a cup of black coffee. The diversity of individuals mirrors the eclectic menu that offers everything from classic cappuccinos to exotic blends from far-flung regions.

Outside the large picture windows, the city continues its frenetic pace, but within the coffee shop's walls, time seems to slow down. It's a place where friendships are forged over shared pots of herbal tea, and where the comforting embrace of a hot beverage becomes a source of solace during rainy afternoons.

The menu boasts not only a variety of coffee options but also an array of pastries and sandwiches that cater to diverse tastes. From flaky croissants to hearty avocado toast, the culinary offerings complement the rich flavors of the coffee, creating a holistic experience for the senses.

As the day transitions into evening, the coffee shop takes on a different ambiance. Soft jazz music replaces the daytime hustle, and the dim lighting casts a cozy glow. It becomes a venue for intimate conversations, where couples share secrets over cups of rich, dark brew and friends gather to celebrate milestones with slices of decadent cake.

The coffee shop is not merely a place to caffeinate; it's a microcosm of human connection and creativity. It serves as a reminder that amid the chaos of modern life, there exist sanctuaries where people can find respite, inspiration, and a good cup of coffee. Whether you're seeking solitude, camaraderie, or simply a moment of pause, the coffee shop welcomes all with open arms and the promise of a delightful sensory journey.`;

const allWords = wordStrings.split(" ");
const shuffleWord = allWords.sort(() => Math.random() - 0.5);
const selectedWords = shuffleWord.slice(0, 500);
const wordString = selectedWords.join(" ");
export default wordString;
