const SUPABASE_URL = 'https://runrnxgdrbkaytuydcss.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bnJueGdkcmJrYXl0dXlkY3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDgwMDAsImV4cCI6MTk4MzY4NDAwMH0.eTaenRCbb6KMg82PtWyN6Md7lu-lSFCxPx-a9-y8WJw';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */
export async function getProfile(user_id) {
    const response = await client
        .from('profiles')
        .select('*')
        .match({ user_id: user_id })
        .maybeSingle();
    return response;
}

export async function getProfileById(id) {
    const response = await client.from('profiles').select('*').match({ id }).single();
    // return checkError(response);

    return response;
}
// }

//     export async function upsertProfile(profile) {
//         const response = await client
//             .from('profiles')
//             .upsert(profile, { onConflict: 'user_id' })
//             .single();

// create getProfileById function
// call it inside createListItem and set it to variable
// pass it through .insert and set it equal to profileId

export async function createListItem(name, quantity, profile_id) {
    const profile = await getProfileById(profile_id);
    const response = await client.from('produce').insert({
        name: name,
        quantity: quantity,
        profile_id: profile,
    });
    // if (response.error) {
    //     console.error(response.error.message);
    // } else {
    return response.data;
}
// }

export async function getList() {
    const response = await client.from('produce').select().match({
        profile_id: client.auth.user().profile_id,
    });
    // if (response.error) {
    //     console.error(response.error.message);
    // } else {
    return response.data;
}
// }
