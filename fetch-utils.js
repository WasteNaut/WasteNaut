const SUPABASE_URL = 'https://runrnxgdrbkaytuydcss.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bnJueGdkcmJrYXl0dXlkY3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDgwMDAsImV4cCI6MTk4MzY4NDAwMH0.eTaenRCbb6KMg82PtWyN6Md7lu-lSFCxPx-a9-y8WJw';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    // console.log(client.auth.user());
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

    return response;
}

export async function upsertProfile(profile) {
    const response = await client
        .from('profiles')
        .upsert(profile, { onConflict: 'user_id' })
        .single();

    return response;
}

export async function createListItem(name, quantity) {
    const user = getUser();
    const profile = await getProfile(user.id);
    const response = await client.from('produce').insert({
        name: name,
        quantity: quantity,
        profile_id: profile.data.id,
    });

    return response.data;
}

export async function createFreshness(freshness, produce_id) {
    const user = getUser();
    const profile = await getProfile(user.id);

    const response = await client.from('expiration').insert({
        produce_id: produce_id,
        freshness: freshness,
    });
    return response.data;
}

export async function getList(profile_id) {
    const response = await client.from('produce').select('*, expiration(*)').match({
        profile_id,
    });

    return response.data;
}

export async function uploadImage(imagePath, imageFile) {
    const bucket = client.storage.from('avatars');
    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        upsert: true,
    });
    if (response.error) {
        return null;
    }
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    return url;
}

export async function deleteList(id) {
    await client.from('expiration').delete('*, produce(id)').match({ produce_id: id });
    await client.from('produce').delete().match({ id });
}

// export async function CheckEx(produce_id, freshness) {
//     const expiration = await getList(produce_id.data.id, freshness.data.date);
//     if (expiration) {
//         const timeRemaining = freshness - Date.now();
//         if (timeRemaining < 86400000) {
//             // 24 hrs * 60 min/hour * 60 sec/min * 1000 milli/sec
//             sendAlert();
//         }
//         console.log('expiration', expiration);
//     }
// }

// export async function sendAlert() {
//     console.log('Expiration alert: 24 hours remaining for one or more items in your tracker!');
// }
